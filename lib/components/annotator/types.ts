import { CSSProperties, ReactNode, RefObject } from 'react';
import { Measurement, Point, Polygon, PolygonColor } from '../../types';

interface PolygonSizeProps {
  imageName: string;
  showLineSize: boolean;
  converterApiUrl: string;
  showOnly?: boolean;
}

export interface ScaleCallbacks {
  scaleUp: () => void;
  scaleReste: () => void;
  scaleDown: () => void;
  xRef: RefObject<HTMLParagraphElement>;
  yRef: RefObject<HTMLParagraphElement>;
}
export interface AnnotatorCanvasProps {
  width: CSSProperties['width'];
  height: CSSProperties['height'];
  image: string;
  setPolygons: (polygon: Polygon[]) => void;
  polygonList: Polygon[];
  zoom: number;
  allowAnnotation?: boolean;
  polygonLineSizeProps?: PolygonSizeProps;
  buttonsComponent?: (callback: ScaleCallbacks) => ReactNode;
  markerPosition?: Point;
  measurementMapper?: (measurement: Measurement, polygons?: Polygon[], index?: number) => Measurement;
  getNewPolygonColor?: (polygons: Polygon[]) => PolygonColor;
  pointRadius?: number;
  closeOnNear?: boolean;
}
