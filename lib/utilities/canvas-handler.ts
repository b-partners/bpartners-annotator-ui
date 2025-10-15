import { ScaleHandler } from '.';
import { POLYGON_LINE_COLOR } from '../constant';
import { MouseType, Point, Polygon } from '../types';

export class CanvasHandler {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private scaleHandler: ScaleHandler;
  private pointRadius: number = 2;

  constructor(canvas: HTMLCanvasElement, scaleHandler: ScaleHandler, pointRadius?: number) {
    this.canvas = canvas;
    this.ctx = (canvas?.getContext('2d') as CanvasRenderingContext2D) || {};
    this.scaleHandler = scaleHandler;

    if (pointRadius !== null && pointRadius !== undefined) {
      this.pointRadius = pointRadius;
    }
  }

  public drawImage(image: HTMLImageElement, x: number, y: number, w: number, h: number) {
    this.clearAll();
    this.ctx.drawImage(image, x, y, w, h);
  }
  public clearAll() {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
  }

  public drawPoint(point: Point) {
    const sc = this.scaleHandler;
    const { x, y } = sc.getPhysicalPositionByPoint(point);
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.arc(x, y, this.pointRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  public drawLines(points: Point[]) {
    const sc = this.scaleHandler;
    const ctx = this.ctx;

    if (points.length === 0) return;

    const { x: x0, y: y0 } = sc.getPhysicalPositionByPoint(points[0]);
    ctx.moveTo(x0, y0);
    points.slice(1).forEach(point => {
      const { x, y } = sc.getPhysicalPositionByPoint(point);
      ctx.lineTo(x, y);
    });
  }

  public drawLinesIndividually(points: Point[]) {
    const sc = this.scaleHandler;
    const ctx = this.ctx;
    ctx.lineWidth = 2;

    if (points.length === 0) return;
    ctx.strokeStyle = POLYGON_LINE_COLOR[0];
    for (let i = 1; i < points.length; i++) {
      const prevPoint = sc.getPhysicalPositionByPoint(points[i - 1]);
      const nextPoint = sc.getPhysicalPositionByPoint(points[i]);
      ctx.beginPath();
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(nextPoint.x, nextPoint.y);
      ctx.stroke();
      ctx.strokeStyle = POLYGON_LINE_COLOR[i];
    }
  }

  drawPolygon(polygons: Polygon[]) {
    const ctx = this.ctx;

    this.clearAll();
    polygons.forEach(polygon => {
      if (!polygon.isInvisible) {
        ctx.strokeStyle = polygon.strokeColor;
        ctx.fillStyle = polygon.fillColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        this.drawLines(polygon.points);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        if (polygon.lineIndividualColor) {
          ctx.save();
          this.drawLinesIndividually(polygon.points);
          ctx.restore();
        }
        ctx.strokeStyle = polygon.strokeColor;
        ctx.fillStyle = polygon.strokeColor;
        polygon.points.forEach(point => this.drawPoint.bind(this)(point));
      }
    });
  }

  public drawMouseCursor({ x, y }: Point, type: MouseType) {
    this.clearAll();
    const ctx = this.ctx;

    ctx.lineWidth = 1;
    ctx.beginPath();
    if (type === 'DEFAULT') {
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'END') {
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.stroke();
    } else if (type === 'ADD_POINT') {
      const size = 3;
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - size);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x, y);
      ctx.lineTo(x - size, y);
      ctx.lineTo(x + size, y);
      ctx.stroke();
    } else {
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.closePath();
  }
}
