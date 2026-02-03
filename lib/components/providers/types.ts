import { ReactNode } from 'react';
import { ElementContextType } from '../..';
import { Measurement, Point, Polygon, PolygonColor } from '../../types';

export interface Children {
  children: ReactNode;
}

export interface ElementProviderProps extends Children, ElementContextType {}
export interface SizesProviderProps extends Children {}
export interface PolygonProviderProps extends Children {
  showLineSize: boolean;
  setPolygons: (polygon: Polygon[]) => void;
  polygons: Polygon[];
  converterApiUrl: string;
  lineSizeShowOnly: boolean;
  allowAnnotation?: boolean;
  zoom: number;
  markerPosition?: Point;
  measurementMapper?: (measurement: Measurement) => Measurement;
  getNewPolygonColor?: (polygons: Polygon[]) => PolygonColor;
  pointRadius?: number;
  closeOnNear?: boolean;
  imagePrecisionLevel?: number;
}
