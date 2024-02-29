/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';
import { useCursorPosition, useElementContext, useMouseDown, usePolygonContext, useSizesContext } from '.';
import { CanvasHandler, EventHandler, ScaleHandler } from '..';

export const useCursorPolygon = () => {
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);
  const polygonCanvasRef = useRef<HTMLCanvasElement>(null);
  const { scale } = useSizesContext();
  const { addPolygon, isDrawing, polygons, polygon, allowAnnotation } = usePolygonContext();

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
        isDrawing,
        polygon,
        polygons,
        scaleHandler,
        allowAnnotation,
      });

      return eventHandler.initEvent(cursorCanvas, addPolygon);
    }
  }, [allowAnnotation, polygons]);

  useEffect(() => {
    if (cursorCanvasRef.current && polygonCanvasRef.current) {
      const cursorCanvas = cursorCanvasRef.current;
      const polygonCanvas = polygonCanvasRef.current;
      const scaleHandler = new ScaleHandler(cursorCanvas, image);
      const canvasPolygonHandler = new CanvasHandler(polygonCanvas, scaleHandler);
      canvasPolygonHandler.clearAll();
      canvasPolygonHandler.drawPolygon([...polygons, polygon.current]);
    }
  }, [polygons, scale]);

  useCursorPosition(cursorCanvasRef);
  useMouseDown(cursorCanvasRef);
  return { cursorCanvasRef, polygonCanvasRef };
};
