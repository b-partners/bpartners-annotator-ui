export class ImageInfoHandler {
  private image: HTMLImageElement;
  private canvas: HTMLCanvasElement;
  // Per-instance scale source (defaultScale + zoom delta). A ref so handlers read the
  // live value at draw/event time without being recreated, while staying isolated to
  // this AnnotatorCanvas instance (no shared global URL state).
  private scaleRef: { current: number };

  constructor(image: HTMLImageElement, canvas: HTMLCanvasElement, scaleRef: { current: number }) {
    this.image = image;
    this.canvas = canvas;
    this.scaleRef = scaleRef;
  }

  getScale() {
    return this.scaleRef.current || 1;
  }

  getScaledSize() {
    const scale = this.getScale();
    const width = this.image.width * scale;
    const height = this.image.height * scale;
    return { width, height };
  }

  getNoScaledSize() {
    const width = this.image.width;
    const height = this.image.height;
    return { width, height };
  }

  getScaledPosition() {
    const { height, width } = this.getScaledSize();
    const x = Math.floor(Math.abs(this.canvas.width - width) / 2);
    const y = Math.floor(Math.abs(this.canvas.height - height) / 2);
    return { x, y };
  }
}
