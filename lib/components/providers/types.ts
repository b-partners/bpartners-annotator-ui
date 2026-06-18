import { ReactNode } from 'react';
import { ElementContextType } from '../..';
import { Measurement, Point, Polygon, PolygonColor } from '../../types';

export interface Children {
  children: ReactNode;
}

export interface ElementProviderProps extends Children, ElementContextType {}
export interface SizesProviderProps extends Children {
  // Controlled zoom delta (added on top of the computed fit scale). When provided the
  // provider is controlled: it never holds its own zoom state and the consumer owns it.
  scale?: number;
  // Notified whenever the zoom delta changes (zoom in/out/reset), so the consumer can
  // persist it (URL, localStorage, …) and keep two instances independent.
  onScaleChange?: (scale: number) => void;
}
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
  edit?: boolean;
  imagePrecisionLevel?: number;
}
