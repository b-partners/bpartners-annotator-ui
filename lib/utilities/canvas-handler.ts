import { Point } from '../types';

export class CanvasHandler {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = (canvas?.getContext('2d') as CanvasRenderingContext2D) || {};
  }

  public drawImage(image: HTMLImageElement, x: number, y: number, w: number, h: number) {
    this.clearAll();
    this.ctx.drawImage(image, x, y, w, h);
  }

  public drawPoint(point: Point) {
    const { x, y } = point;
    this.ctx.beginPath();
    this.ctx.fillStyle = 'black';
    this.ctx.arc(x, y, 2, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.closePath();
  }

  public clearAll() {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
  }
}
