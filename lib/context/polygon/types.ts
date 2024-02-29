import { MutableRefObject } from 'react';
import { Polygon } from '../../types';

export interface PolygonContextType {
  polygons: Polygon[];
  addPolygon: (polygon: Polygon) => void;
  polygon: MutableRefObject<Polygon>;
  isDrawing: MutableRefObject<boolean>;
  allowAnnotation?: boolean;
}
