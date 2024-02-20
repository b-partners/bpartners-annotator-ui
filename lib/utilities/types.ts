import { CanvasHandler, ScaleHandler } from '.';
import { Point, Polygon } from '../types';

export interface ImageInfo {
  imageHeight: number;
  imageWidth: number;
  imageX: number;
  imageY: number;
}

export interface PointInfo {
  index: number;
  point: Point;
}

export interface EventHandlerParams {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  isAnnotating: boolean;
  polygon: Polygon;
  polygons: Polygon[];
  canvasPolygonHandler: CanvasHandler;
  canvasCursorHandler: CanvasHandler;
  scaleHandler: ScaleHandler;
  allowAnnotation?: boolean;
}
