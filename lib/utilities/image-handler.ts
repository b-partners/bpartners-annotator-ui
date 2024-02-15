import { UrlParams } from '.';
import { SCALE_VALUE_QUERY_NAME } from '../constant';

export class ImageInfoHandler {
  private image: HTMLImageElement;
  private canvas: HTMLCanvasElement;

  constructor(image: HTMLImageElement, canvas: HTMLCanvasElement) {
    this.image = image;
    this.canvas = canvas;
  }

  getScale() {
    return +(UrlParams.get(SCALE_VALUE_QUERY_NAME) || '1');
  }

  getScaledSize() {
    const scale = this.getScale();
    const width = this.image.width * scale;
    const height = this.image.height * scale;
    return { width, height };
  }

  getScaledPosition() {
    const { height, width } = this.getScaledSize();
    const x = Math.floor(Math.abs(this.canvas.width - width) / 2);
    const y = Math.floor(Math.abs(this.canvas.height - height) / 2);
    return { x, y };
  }
}
