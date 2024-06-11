import { MutableRefObject } from 'react';
import { Marker, Polygon } from '../../types';

export interface PolygonContextType {
  polygons: Polygon[];
  showLineSize: boolean;
  converterApiUrl: string;
  setPolygons: (polygon: Polygon[]) => void;
  polygon: MutableRefObject<Polygon>;
  isDrawing: MutableRefObject<boolean>;
  allowAnnotation?: boolean;
  zoom: number;
  circleMarker?: Marker;
}
