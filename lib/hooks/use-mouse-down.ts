import { RefObject, useContext, useEffect } from 'react';
import { ScaleHandler, SizesContext, useElementContext } from '..';

export const useMouseDown = (canvasRef: RefObject<HTMLCanvasElement>) => {
  const { image } = useElementContext();
  const { scaleRef } = useContext(SizesContext);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const scaleHandler = new ScaleHandler(canvas, image, scaleRef);

      const eventHandler = (event: MouseEvent) => {
        scaleHandler.getLogicalPosition(event);
      };

      canvas.addEventListener('mousedown', eventHandler);
      return () => canvas.removeEventListener('mousedown', eventHandler);
    }
  }, [canvasRef, image, scaleRef]);
};
