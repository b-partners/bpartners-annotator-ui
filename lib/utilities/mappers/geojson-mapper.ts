import getAreaOfPolygon from 'geolib/es/getAreaOfPolygon';
import getDistance from 'geolib/es/getPreciseDistance';
import { GeoPointMapper, findMidpoint, getCenterOfPolygon } from '..';
import { GeojsonReturn, Measurement, Polygon } from '../..';

export class GeojsonMapper {
  public static toMeasurements(restGeojson: GeojsonReturn[], domainPolygons: Polygon[]): Measurement[] {
    const measurements: Measurement[] = [];

    restGeojson.forEach(geojson => {
      const associatedPolygon = domainPolygons.find(polygon => polygon.id === geojson.properties.id);
      const coordinates = geojson.geometry.coordinates[0][0];

      if (associatedPolygon) {
        const area = this.toArea(geojson, associatedPolygon);
        measurements.push(area as Measurement);
        for (let a = 1; a < coordinates.length; a++) {
          const prevCoordinate = coordinates[a - 1];
          const currentCoordinate = coordinates[a];

          const prevPoint = associatedPolygon.points[a - 1];
          const currentPoint = associatedPolygon.points[a];

          measurements.push({
            polygonId: associatedPolygon.id,
            position: findMidpoint([prevPoint, currentPoint]),
            unity: 'm',
            value: getDistance(GeoPointMapper.toGeoLocation(prevCoordinate), GeoPointMapper.toGeoLocation(currentCoordinate)),
          });
        }
      }
    });

    return measurements;
  }

  private static toArea(restGeojson: GeojsonReturn, domainPolygon: Polygon): Measurement {
    const area = getAreaOfPolygon(restGeojson.geometry.coordinates[0][0].map(GeoPointMapper.toGeoLocation));
    const position = getCenterOfPolygon(domainPolygon.points);
    return {
      polygonId: domainPolygon.id,
      position,
      unity: 'm²',
      value: Math.round(area),
    };
  }
}
