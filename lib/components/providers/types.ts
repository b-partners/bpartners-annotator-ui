import { ReactNode } from 'react';
import { ElementContextType } from '../..';
import { Point, Polygon } from '../../types';

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
  allowAnnotation?: boolean;
  zoom: number;
  markerPosition?: Point;
}
