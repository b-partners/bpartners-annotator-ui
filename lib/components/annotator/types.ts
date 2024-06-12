import { CSSProperties, ReactNode } from 'react';
import { Point, Polygon } from '../../types';

interface PolygonSizeProps {
  imageName: string;
  showLineSize: boolean;
  converterApiUrl: string;
}

export interface ScaleCallbacks {
  scaleUp: () => void;
  scaleReste: () => void;
  scaleDown: () => void;
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
}
