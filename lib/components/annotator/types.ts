import { CSSProperties } from 'react';
import { Polygon } from '../../types';

export interface AnnotatorCanvasProps {
  width: CSSProperties['width'];
  height: CSSProperties['height'];
  image: string;
  addPolygone: (polygone: Polygon) => void;
  polygoneList: Polygon[];
  allowAnnotation?: boolean;
}
