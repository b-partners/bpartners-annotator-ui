import { GeoLocation, Point } from '../..';

export class PointMapper {
  public static toGeoLocation({ x, y }: Point) {
    return {
      longitude: x,
      latitude: y,
    } as GeoLocation;
  }

  public static geoLocationToPoint({ longitude, latitude }: GeoLocation) {
    return {
      x: longitude,
      y: latitude,
    };
  }
}
