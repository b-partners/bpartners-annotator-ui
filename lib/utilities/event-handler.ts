import { MutableRefObject } from 'react';
import { CanvasHandler, EventHandlerParams, PointInfo, ScaleHandler, areOverlappingPoints, findMidpoint, getColorFromMain, pointBelongsToOrIsClose } from '.';
import { defaultPolygon } from '../constant';
import { Point, Polygon } from '../types';
import { getPolygonLastColors } from './polygon-tools';
import { v4 as uuidV4 } from 'uuid';

export class EventHandler {
  private isDrawing: MutableRefObject<boolean>;
  private allowAnnotation: boolean;
  private polygon: MutableRefObject<Polygon>;
  private polygons: Polygon[];
  private canvasCursorHandler: CanvasHandler;
  private canvasPolygonHandler: CanvasHandler;
  private pointsInfo: PointInfo[] = [];
  private currentPointInfo: PointInfo | null = null;
  private scaleHandler: ScaleHandler;
  private currentMiddlePosition: (PointInfo & { annotationIndex: number }) | null = null;

  constructor(params: EventHandlerParams) {
    const { canvasCursorHandler, canvasPolygonHandler, isDrawing, polygon, polygons, scaleHandler, allowAnnotation } = params;
    this.scaleHandler = scaleHandler;
    this.allowAnnotation = allowAnnotation || false;
    this.isDrawing = isDrawing;
    this.polygons = polygons;
    this.canvasCursorHandler = canvasCursorHandler;
    this.canvasPolygonHandler = canvasPolygonHandler;
    this.polygon = polygon;
    this.createPointInfo();
  }

  public initEvent = (canvas: HTMLCanvasElement, addPolygon: (polygon: Polygon) => void) => {
    this.draw();
    const mouseLeave = this.mouseLeave.bind(this);
    const escapeKeyDown = this.escapeKeyDown.bind(this);
    const mouseMove = this.mouseMove.bind(this);
    const mouseUp = this.mouseUp.bind(this);
    const mouseDownEventHandler = this.mouseDown(polygon => addPolygon(polygon));

    canvas.addEventListener('mousemove', mouseMove);
    canvas.addEventListener('mouseleave', mouseLeave);

    if (this.allowAnnotation) {
      canvas.addEventListener('mousedown', mouseDownEventHandler);
      canvas.addEventListener('mouseup', mouseUp);
      window.addEventListener('keydown', escapeKeyDown);
    }

    return () => {
      canvas.removeEventListener('mousemove', mouseMove);
      canvas.removeEventListener('mouseleave', mouseLeave);
      if (this.allowAnnotation) {
        canvas.removeEventListener('mousedown', mouseDownEventHandler);
        canvas.removeEventListener('mouseup', mouseUp);
        window.removeEventListener('keydown', escapeKeyDown);
      }
    };
  };

  private mouseUp() {
    this.currentPointInfo = null;
    this.createPointInfo();
  }

  private mouseLeave() {
    this.canvasCursorHandler.clearAll();
  }

  private escapeKeyDown(event: KeyboardEvent) {
    if (this.isDrawing.current && (event.key === 'Escape' || event.key === 'Backspace')) {
      this.polygon.current.points.pop();
      if (this.polygon.current.points.length === 0) {
        this.isDrawing.current = false;
        this.currentPointInfo = null;
      }
      this.draw();
    }
  }

  private mouseMove = (event: MouseEvent) => {
    const sc = this.scaleHandler;

    const currentPhysicalPosition = sc.getPhysicalPositionByEvent(event);
    const currentLogicalPosition = sc.getLogicalPosition(event);

    const canvasCursorHandler = this.canvasCursorHandler;

    const isPointInAnnotation = this.pointsInfo.find(value => areOverlappingPoints(value.point, currentLogicalPosition));
    const points = this.polygon.current.points;

    if (points.length > 0 && areOverlappingPoints(points[0], currentLogicalPosition)) {
      canvasCursorHandler.drawMouseCursor(currentPhysicalPosition, 'END');
    } else if (!this.isDrawing.current && isPointInAnnotation) {
      canvasCursorHandler.drawMouseCursor(currentPhysicalPosition, 'UNDER_POINT');
    } else if (this.currentMiddlePosition) {
      canvasCursorHandler.drawMouseCursor(currentPhysicalPosition, 'ADD_POINT');
    } else {
      canvasCursorHandler.drawMouseCursor(currentPhysicalPosition, 'DEFAULT');
    }

    if (!this.isDrawing.current && this.currentPointInfo !== null) {
      const { index } = this.currentPointInfo;
      const points = this.polygons[index].points;
      const lastIndex = points.length - 1;

      if (index === 0 || index === lastIndex) {
        points[lastIndex] = currentLogicalPosition;
        points[0] = currentLogicalPosition;
      } else {
        points[index] = currentLogicalPosition;
      }
      this.draw();
    }

    if (!this.isDrawing.current) {
      for (let index = 0; index < this.polygons.length; index++) {
        const currentPolygon = this.polygons[index];
        if (!currentPolygon.isInvisible) {
          for (let a = 1; a < currentPolygon.points.length; a++) {
            const segment = [currentPolygon.points[a - 1], currentPolygon.points[a]] as [Point, Point];
            const areTooClose = pointBelongsToOrIsClose(currentLogicalPosition, segment);
            if (areTooClose) {
              this.currentMiddlePosition = {
                annotationIndex: index,
                index: a,
                point: findMidpoint(segment),
              };
              return;
            }

            this.currentMiddlePosition = null;
          }
        }
      }
    }
  };

  private mouseDown = (end: (polygon: Polygon) => void) => (event: MouseEvent) => {
    const sc = this.scaleHandler;
    const polygon = this.polygon.current;
    const points = polygon.points;
    const currentLogicalPosition = sc.getLogicalPosition(event);
    const currentPhysicalPosition = sc.getPhysicalPositionByEvent(event);
    const canvasCursorHandler = this.canvasCursorHandler;

    if (this.isDrawing.current && points.length > 1 && areOverlappingPoints(points[0], currentLogicalPosition)) {
      points.push(points[0]);
      canvasCursorHandler.drawMouseCursor(currentPhysicalPosition, 'DEFAULT');
      const colors = getPolygonLastColors(this.polygons);
      if (colors) {
        polygon.fillColor = colors.fillColor;
        polygon.strokeColor = colors.strokeColor;
      }
      this.isDrawing.current = false;
      this.polygon.current = { ...defaultPolygon, id: uuidV4() };
      this.draw();
      end(polygon);
      return;
    } else if (this.isDrawing.current) {
      points.push(currentLogicalPosition);
      this.draw();
    } else if (!this.isDrawing.current) {
      this.currentPointInfo = this.pointsInfo.find(value => areOverlappingPoints(value.point, currentLogicalPosition)) || null;
    }

    if (!this.currentMiddlePosition && !this.isDrawing.current && !this.currentPointInfo && !sc.isPointOutsideOrImage(currentLogicalPosition)) {
      this.isDrawing.current = true;
      this.polygon.current = { ...getColorFromMain('#00ff00'), points: [currentLogicalPosition], id: uuidV4() };
      this.draw();
    }

    if (this.currentMiddlePosition && !this.currentPointInfo && !this.isDrawing.current) {
      const annotationIndex = this.currentMiddlePosition.annotationIndex;
      const pointIndex = this.currentMiddlePosition.index;
      const point = this.currentMiddlePosition.point;

      this.polygons[annotationIndex].points.splice(pointIndex, 0, point);
      this.currentMiddlePosition = null;
      this.createPointInfo();
      this.draw();
    }
  };

  private draw() {
    const polygonsToDraw = [...(this.polygons.filter(polygon => !polygon.isInvisible) || []), this.polygon.current];
    this.canvasPolygonHandler.drawPolygon(polygonsToDraw);
  }

  private createPointInfo() {
    this.pointsInfo = [];
    this.polygons
      .filter(polygon => !polygon.isInvisible)
      .forEach(polygon => {
        polygon.points.forEach((point, index) => {
          this.pointsInfo.push({ index, point });
        });
      });
  }
}
