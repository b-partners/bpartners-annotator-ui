import { Polygon } from '../../types';

export interface PolygonContextType {
  polygons: Polygon[];
  addPolygons: (polygon: Polygon) => void;
}
