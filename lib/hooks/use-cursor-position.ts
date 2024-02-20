import { RefObject, useEffect } from 'react';
import { ScaleHandler, useElementContext, usePositionsContext } from '..';

export const useCursorPosition = (canvasRef: RefObject<HTMLCanvasElement>) => {
  const { image } = useElementContext();
  const { setCursorPosition } = usePositionsContext();

  useEffect(() => {
    if (canvasRef.current) {
      const currentCanvas = canvasRef.current;
      const scaleHandler = new ScaleHandler(currentCanvas, image);

      const eventListener = (event: MouseEvent) => {
        setCursorPosition(scaleHandler.getRestrictedPhysicalPositionByEvent(event));
      };

      currentCanvas.addEventListener('mousemove', eventListener);
      return () => currentCanvas.removeEventListener('mousemove', eventListener);
    }
  }, [canvasRef, image, setCursorPosition]);
};
