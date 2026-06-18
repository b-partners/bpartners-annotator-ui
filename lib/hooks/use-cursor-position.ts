/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, useContext, useEffect } from 'react';
import { ScaleHandler, SizesContext, useElementContext, usePositionsContext } from '..';

export const useCursorPosition = (canvasRef: RefObject<HTMLCanvasElement>) => {
  const { image } = useElementContext();
  const { xRef, yRef } = usePositionsContext();
  const { scaleRef } = useContext(SizesContext);

  useEffect(() => {
    if (canvasRef.current) {
      const currentCanvas = canvasRef.current;
      const scaleHandler = new ScaleHandler(currentCanvas, image, scaleRef);

      const eventListener = (event: MouseEvent) => {
        const { x, y } = scaleHandler.getRestrictedPhysicalPositionByEvent(event);
        if (xRef.current && yRef.current) {
          xRef.current.innerHTML = `x : ${x}`;
          yRef.current.innerHTML = `y : ${y}`;
        }
      };

      currentCanvas.addEventListener('mousemove', eventListener);
      return () => currentCanvas.removeEventListener('mousemove', eventListener);
    }
  }, [canvasRef, image]);
};
