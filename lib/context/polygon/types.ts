import { MutableRefObject } from 'react';
import { Measurement, Point, Polygon, PolygonColor } from '../../types';

export interface PolygonContextType {
  polygons: Polygon[];
  showLineSize: boolean;
  converterApiUrl: string;
  setPolygons: (polygon: Polygon[]) => void;
  polygon: MutableRefObject<Polygon>;
  isDrawing: MutableRefObject<boolean>;
  allowAnnotation?: boolean;
  zoom: number;
  markerPosition?: Point;
  measurementMapper?: (measurement: Measurement, polygons?: Polygon[], index?: number) => Measurement;
  getNewPolygonColor?: (polygons: Polygon[]) => PolygonColor;
  pointRadius?: number;
  closeOnNear?: boolean;
  lineSizeShowOnly: boolean;
  imagePrecisionLevel?: number;
}
