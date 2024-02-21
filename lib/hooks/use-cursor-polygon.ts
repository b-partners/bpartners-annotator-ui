import { useEffect, useRef } from 'react';
import { useCursorPosition, useElementContext, useMouseDown, usePolygonContext, usePositionsContext } from '.';
import { CanvasHandler, EventHandler, ScaleHandler } from '..';

export const useCursorPolygon = () => {
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);
  const polygonCanvasRef = useRef<HTMLCanvasElement>(null);
  const { addPolygon, isDrawing, polygons, polygon } = usePolygonContext();

  const { setCursorPosition } = usePositionsContext();
  const { image } = useElementContext();

  useEffect(() => {
    if (cursorCanvasRef.current && polygonCanvasRef.current) {
      const cursorCanvas = cursorCanvasRef.current;
      const polygonCanvas = polygonCanvasRef.current;
      const scaleHandler = new ScaleHandler(cursorCanvas, image);
      const canvasCursorHandler = new CanvasHandler(cursorCanvas, scaleHandler);
      const canvasPolygonHandler = new CanvasHandler(polygonCanvas, scaleHandler);

      const eventHandler = new EventHandler({
        canvas: cursorCanvas,
        canvasCursorHandler,
        canvasPolygonHandler,
        image,
        isAnnotating: isDrawing,
        polygon,
        polygons,
        scaleHandler,
      });

      return eventHandler.initEvent(cursorCanvas, addPolygon);
    }
  }, [addPolygon, image, isDrawing, polygon, polygons, setCursorPosition]);

  useCursorPosition(cursorCanvasRef);
  useMouseDown(cursorCanvasRef);
  return { cursorCanvasRef, polygonCanvasRef };
};
