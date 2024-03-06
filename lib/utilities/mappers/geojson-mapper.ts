import getDistance from 'geolib/es/getPreciseDistance';
import { GeoPointMapper, findMidpoint } from '..';
import { GeojsonReturn, Measurement, Polygon } from '../..';

export class GeojsonMapper {
  public static toMeasurements(geojson: GeojsonReturn[], polygons: Polygon[]) {
    const measurements: Measurement[] = [];

    geojson.forEach(geojson => {
      const associatedPolygon = polygons.find(polygon => polygon.id === geojson.properties.id);
      const coordinates = geojson.geometry.coordinates[0][0];

      if (associatedPolygon) {
        for (let a = 1; a < coordinates.length; a++) {
          const prevCoordinate = coordinates[a - 1];
          const currentCoordinate = coordinates[a];

          const prevPoint = associatedPolygon.points[a - 1];
          const currentPoint = associatedPolygon.points[a];

          measurements.push({
            position: findMidpoint([prevPoint, currentPoint]),
            unity: 'm',
            value: getDistance(GeoPointMapper.toGeoLocation(prevCoordinate), GeoPointMapper.toGeoLocation(currentCoordinate)),
          });
        }
      }
    });

    return measurements;
  }
}
