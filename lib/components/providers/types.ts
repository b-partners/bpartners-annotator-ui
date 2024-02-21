import { ReactNode } from 'react';
import { ElementContextType } from '../..';
import { Polygon } from '../../types';

export interface Children {
  children: ReactNode;
}

export interface ElementProviderProps extends Children, ElementContextType {}
export interface SizesProviderProps extends Children {}
export interface PolygonProviderProps extends Children {
  addPolygons: (polygon: Polygon) => void;
  polygons: Polygon[];
}
