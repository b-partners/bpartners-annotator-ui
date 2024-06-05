/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';
import { useCursorPosition, useDrawPolygon, useElementContext, useMouseDown, usePolygonContext } from '.';
import { CanvasHandler, EventHandler, ScaleHandler } from '..';

export const useCursorPolygon = () => {
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);
  const polygonCanvasRef = useRef<HTMLCanvasElement>(null);
  const { setPolygons, isDrawing, polygons, polygon, allowAnnotation, circleMarker } = usePolygonContext();
  const { image } = useElementContext();

  useEffect(() => {
    if (cursorCanvasRef.current && polygonCanvasRef.current) {
      const cursorCanvas = cursorCanvasRef.current;
      const polygonCanvas = polygonCanvasRef.current;
      const scaleHandler = new ScaleHandler(cursorCanvas, image);
      const canvasCursorHandler = new CanvasHandler(cursorCanvas, scaleHandler);
      const canvasPolygonHandler = new CanvasHandler(polygonCanvas, scaleHandler, circleMarker);

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

      return eventHandler.initEvent(cursorCanvas, setPolygons);
    }
  }, [allowAnnotation, polygons, circleMarker]);

  useDrawPolygon(cursorCanvasRef, polygonCanvasRef);
  useCursorPosition(cursorCanvasRef);
  useMouseDown(cursorCanvasRef);
  return { cursorCanvasRef, polygonCanvasRef };
};
