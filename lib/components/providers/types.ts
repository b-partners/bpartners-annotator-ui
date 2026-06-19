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
  // Saved viewport-center position as a 0..1 fraction of the scrollable area. When provided
  // the view is restored to it on (re)mount instead of recentering on the image, mirroring
  // how `scale` is persisted. Scale-independent so it survives the canvas being resized by zoom.
  scrollPosition?: Point;
  // Notified whenever the user scrolls, with the new viewport-center fraction, so the consumer
  // can persist it alongside `scale` and restore it via `scrollPosition`.
  onScrollChange?: (position: Point) => void;
  // localStorage key under which this instance persists its own zoom + scroll. When set the
  // provider restores the saved view on (re)mount and writes it back on zoom/scroll, so the
  // consumer gets persistence for free (no `scale`/`scrollPosition` state to thread).
  storageKey?: string;
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
