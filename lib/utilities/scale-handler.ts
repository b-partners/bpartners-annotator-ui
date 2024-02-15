import { ImageInfoHandler } from '.';

export class ScaleHandler {
  private canvas: HTMLCanvasElement;
  private imageInfoHandler: ImageInfoHandler;

  constructor(canvas: HTMLCanvasElement, image: HTMLImageElement) {
    this.canvas = canvas;
    this.imageInfoHandler = new ImageInfoHandler(image, canvas);
  }
  public getPhysicalPositionByEvent = (event: MouseEvent) => {
    const canvasRect = this.canvas.getBoundingClientRect();
    const x = event.clientX - Math.floor(canvasRect?.left || 0);
    const y = event.clientY - Math.floor(canvasRect?.top || 0);
    return { x, y };
  };

  public getRestrictedPhysicalPositionByEvent = (event: MouseEvent) => {
    const { x, y } = this.imageInfoHandler.getScaledPosition();
    const { height, width } = this.imageInfoHandler.getScaledSize();
    const currentPhysicalPosition = this.getPhysicalPositionByEvent(event);
    currentPhysicalPosition.x = Math.round(this.getRestrictedValue(currentPhysicalPosition.x, x, width + x));
    currentPhysicalPosition.y = Math.round(this.getRestrictedValue(currentPhysicalPosition.y, y, height + y));
    return currentPhysicalPosition;
  };

  public getRestrictedValue(value: number, min: number, max: number) {
    return value > max ? max - min : value < min ? 0 : value - min;
  }
}
