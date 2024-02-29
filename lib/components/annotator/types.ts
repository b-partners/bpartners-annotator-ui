import { CSSProperties } from 'react';
import { Polygon } from '../../types';

export interface AnnotatorCanvasProps {
  width: CSSProperties['width'];
  height: CSSProperties['height'];
  image: string;
  addPolygon: (polygon: Polygon) => void;
  polygonList: Polygon[];
  allowAnnotation?: boolean;
}
