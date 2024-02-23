import { RefObject, useEffect } from 'react';
import { ScaleHandler, useElementContext } from '..';

export const useMouseDown = (canvasRef: RefObject<HTMLCanvasElement>) => {
  //   const currentPolygon = useRef<Polygon>({ ...getColorFromMain('#00ff00'), points: [] });
  //   const isDrawing = useRef<boolean>(false);
  const { image } = useElementContext();

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const scaleHandler = new ScaleHandler(canvas, image);

      const eventHandler = (event: MouseEvent) => {
        scaleHandler.getLogicalPosition(event);
      };

      canvas.addEventListener('mousedown', eventHandler);
      return () => canvas.removeEventListener('mousedown', eventHandler);
    }
  }, [canvasRef, image]);
};
