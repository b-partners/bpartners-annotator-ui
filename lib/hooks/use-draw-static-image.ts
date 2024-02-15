import { useEffect, useRef } from 'react';
import { useElementContext, useImagePosition, useSizesContext } from '.';
import { CanvasHandler } from '..';

export const useDrawStaticImage = () => {
  const { imageHeight, imageWidth } = useSizesContext();
  const { image } = useElementContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { imageX, imageY } = useImagePosition();

  useEffect(() => {
    if (image.src.length > 0 && canvasRef) {
      const canvasImageHandler = new CanvasHandler(canvasRef.current as HTMLCanvasElement);
      canvasImageHandler.drawImage(image, imageX, imageY, imageWidth, imageHeight);
    }
  }, [image, imageX, imageY, imageWidth, imageHeight, canvasRef]);

  return canvasRef;
};
