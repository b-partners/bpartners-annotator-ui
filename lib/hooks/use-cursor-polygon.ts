import { useEffect, useRef } from 'react';
import { useElementContext, usePositionsContext } from '.';
import { CanvasHandler, EventHandler, ScaleHandler } from '..';
import { Polygon } from '../types';

export const useCursorPolygon = () => {
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);
  const polygonCanvasRef = useRef<HTMLCanvasElement>(null);
  const polygon = useRef<Polygon>({ fillColor: '', points: [], strokeColor: '' });
  const isAnnotating = useRef<boolean>(false);

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
        isAnnotating: isAnnotating.current,
        polygon: polygon.current,
        polygons: [],
        scaleHandler,
      });

      return eventHandler.initEvent(cursorCanvas, () => {});
    }
  }, [image, setCursorPosition]);

  return { cursorCanvasRef, polygonCanvasRef };
};
