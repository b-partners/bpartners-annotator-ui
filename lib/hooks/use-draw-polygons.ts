/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, useEffect } from 'react';
import { useElementContext, usePolygonContext, useSizesContext } from '.';
import { ScaleHandler, CanvasHandler } from '..';

export const useDrawPolygon = (cursorCanvasRef: RefObject<HTMLCanvasElement>, polygonCanvasRef: RefObject<HTMLCanvasElement>) => {
  const { scale, scaleRef } = useSizesContext();
  const { polygons, polygon, pointRadius } = usePolygonContext();
  const { image } = useElementContext();

  useEffect(() => {
    if (cursorCanvasRef.current && polygonCanvasRef.current) {
      const cursorCanvas = cursorCanvasRef.current;
      const polygonCanvas = polygonCanvasRef.current;
      const scaleHandler = new ScaleHandler(cursorCanvas, image, scaleRef);
      const canvasPolygonHandler = new CanvasHandler(polygonCanvas, scaleHandler, pointRadius);
      canvasPolygonHandler.clearAll();
      canvasPolygonHandler.drawPolygon([...polygons, polygon.current]);
    }
  }, [polygons, scale, pointRadius]);
};
