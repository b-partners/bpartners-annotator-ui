import { Polygon } from '../types';

export const getPolygonLastColors = (polygons: Polygon[]) => {
  if (polygons.length === 0) return null;
  const { fillColor, strokeColor } = polygons[polygons.length - 1];
  return { fillColor, strokeColor };
};
