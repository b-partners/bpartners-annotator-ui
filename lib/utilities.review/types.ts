import { MutableRefObject } from 'react';
import { CanvasHandler, ScaleHandler } from '.';
import { Point, Polygon } from '../types';

export interface ImageInfo {
  imageHeight: number;
  imageWidth: number;
  imageX: number;
  imageY: number;
}

export interface PointInfo {
  polygonId: string;
  index: number;
  point: Point;
}

export interface EventHandlerParams {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  isDrawing: MutableRefObject<boolean>;
  polygon: MutableRefObject<Polygon>;
  polygons: Polygon[];
  canvasPolygonHandler: CanvasHandler;
  canvasCursorHandler: CanvasHandler;
  scaleHandler: ScaleHandler;
  allowAnnotation?: boolean;
}
