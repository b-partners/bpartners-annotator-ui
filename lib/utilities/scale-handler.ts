import { ImageInfoHandler } from '.';
import { Point } from '../types';

export class ScaleHandler {
  private canvas: HTMLCanvasElement;
  private imageInfoHandler: ImageInfoHandler;

  constructor(canvas: HTMLCanvasElement, image: HTMLImageElement) {
    this.canvas = canvas;
    this.imageInfoHandler = new ImageInfoHandler(image, canvas);
  }

  /**
   * Get the cursor position in the canvas, where the top edge of the canvas is the origin
   * @param event
   * @returns
   */
  public getPhysicalPositionByEvent = (event: MouseEvent) => {
    const canvasRect = this.canvas.getBoundingClientRect();
    const x = event.clientX - Math.floor(canvasRect?.left || 0);
    const y = event.clientY - Math.floor(canvasRect?.top || 0);
    return { x, y };
  };

  /**
   * cursor position in the canvas, where the top edge of the image is the origin
   * @param event
   * @returns
   */
  public getRestrictedPhysicalPositionByEvent = (event: MouseEvent) => {
    const { x, y } = this.imageInfoHandler.getScaledPosition();
    const { height, width } = this.imageInfoHandler.getScaledSize();
    const currentPhysicalPosition = this.getPhysicalPositionByEvent(event);
    currentPhysicalPosition.x = Math.round(this.getRestrictedValue(currentPhysicalPosition.x, x, width + x));
    currentPhysicalPosition.y = Math.round(this.getRestrictedValue(currentPhysicalPosition.y, y, height + y));
    return currentPhysicalPosition;
  };

  /**
   * Transform the current value to a value between min and max
   * @param value
   * @param min
   * @param max
   * @returns
   */
  public getRestrictedValue(value: number, min: number, max: number) {
    return value > max ? max - min : value < min ? 0 : value - min;
  }

  /**
   * Get the current scale from the url params
   * @returns
   */
  private getScale() {
    return this.imageInfoHandler.getScale();
  }

  /**
   * Get the offset of the image in it's initial size
   * @returns
   */
  private getImageOffset() {
    return this.imageInfoHandler.getScaledPosition();
  }

  /**
   * Use the current scale value to scale up one point
   * @param param0
   * @returns
   */
  private getScaledUpPosition = ({ x, y }: Point) => {
    const scale = this.getScale();
    return { x: x * scale, y: y * scale };
  };

  public getScaledDownValue = (value: number) => {
    const scale = this.getScale();
    return scale * value;
  };

  /**
   * Use the current scale value to scale down one point
   * @param param0
   * @returns
   */
  private getScaledDownPosition = ({ x, y }: Point) => {
    const scale = this.getScale();
    return { x: x / scale, y: y / scale };
  };

  /**
   * Transform one point with the image initial size scale to the current image size scale
   * @param point
   * @returns
   */
  public getPhysicalPositionByPoint = (point: Point) => {
    const { x, y } = this.getScaledUpPosition(point);
    const { y: iho, x: iwo } = this.getImageOffset();
    return { x: Math.floor(x + iwo), y: Math.floor(y + iho) };
  };

  /**
   * Transform one point with the current image size scale to the image initial size scale
   * @param event
   * @returns
   */
  public getLogicalPosition(event: MouseEvent) {
    const currentPhysicalRestrictedPosition = this.getRestrictedPhysicalPositionByEvent(event);
    return this.getScaledDownPosition(currentPhysicalRestrictedPosition);
  }

  /**
   * Check if the current cursor position is inside or outside of the image area
   * @param point
   * @returns
   */
  public isPointOutsideOrImage(point: Point) {
    const { width, height } = this.imageInfoHandler.getNoScaledSize();
    const testingValues = [0, width, height, width - 1, height - 1, width + 1, height + 1];
    return testingValues.includes(Math.round(point.x)) || testingValues.includes(Math.round(point.y));
  }
}
