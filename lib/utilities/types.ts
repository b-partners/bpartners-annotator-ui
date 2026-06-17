import { MutableRefObject, RefObject } from 'react';
import { CanvasHandler, ScaleHandler } from '.';
import { Point, Polygon, PolygonColor } from '../types';

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
  isMoving: boolean;
  polygon: MutableRefObject<Polygon>;
  polygons: Polygon[];
  canvasPolygonHandler: CanvasHandler;
  canvasCursorHandler: CanvasHandler;
  scaleHandler: ScaleHandler;
  allowAnnotation?: boolean;
  getNewPolygonColor?: (polygons: Polygon[]) => PolygonColor;
  closeOnNear?: boolean;
  edit?: boolean;
  containerRef: RefObject<HTMLDivElement>;
}
