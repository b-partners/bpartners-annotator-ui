import { Polygon } from '../../types';

export interface PolygonContextType {
  polygons: Polygon[];
  addPolygon: (polygon: Polygon) => void;
  polygon: Polygon;
  isDrawing: boolean;
  allowAnnotation?: boolean;
}
