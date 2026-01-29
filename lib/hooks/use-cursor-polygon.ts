/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';
import { useCursorPosition, useDrawPolygon, useElementContext, useMouseDown, usePolygonContext, useSizesContext } from '.';
import { CanvasHandler, EventHandler, ScaleHandler } from '..';

export const useCursorPolygon = () => {
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);
  const polygonCanvasRef = useRef<HTMLCanvasElement>(null);
  const { setPolygons, getNewPolygonColor, isDrawing, polygons, polygon, allowAnnotation, pointRadius, closeOnNear } = usePolygonContext();
  const { image, containerRef } = useElementContext();
  const { isMoving } = useSizesContext();

  useEffect(() => {
    if (cursorCanvasRef.current && polygonCanvasRef.current) {
      const cursorCanvas = cursorCanvasRef.current;
      const polygonCanvas = polygonCanvasRef.current;
      const scaleHandler = new ScaleHandler(cursorCanvas, image);
      const canvasCursorHandler = new CanvasHandler(cursorCanvas, scaleHandler, pointRadius);
      const canvasPolygonHandler = new CanvasHandler(polygonCanvas, scaleHandler, pointRadius);

      const eventHandler = new EventHandler({
        getNewPolygonColor,
        canvas: cursorCanvas,
        canvasCursorHandler,
        canvasPolygonHandler,
        image,
        isDrawing,
        polygon,
        polygons,
        scaleHandler,
        allowAnnotation,
        closeOnNear,
        isMoving,
        containerRef,
      });

      return eventHandler.initEvent(cursorCanvas, setPolygons);
    }
  }, [allowAnnotation, polygons, pointRadius, isMoving]);

  useDrawPolygon(cursorCanvasRef, polygonCanvasRef);
  useCursorPosition(cursorCanvasRef);
  useMouseDown(cursorCanvasRef);
  return { cursorCanvasRef, polygonCanvasRef };
};
