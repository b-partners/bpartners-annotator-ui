/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, useEffect } from 'react';
import { useElementContext, usePolygonContext, useSizesContext } from '.';
import { ScaleHandler, CanvasHandler, UrlParams } from '..';

export const useDrawPolygon = (cursorCanvasRef: RefObject<HTMLCanvasElement>, polygonCanvasRef: RefObject<HTMLCanvasElement>) => {
  const { scale } = useSizesContext();
  const { polygons, polygon } = usePolygonContext();
  const { image } = useElementContext();

  useEffect(() => {
    if (cursorCanvasRef.current && polygonCanvasRef.current) {
      UrlParams.set('scale', scale.toFixed(2));
      const cursorCanvas = cursorCanvasRef.current;
      const polygonCanvas = polygonCanvasRef.current;
      const scaleHandler = new ScaleHandler(cursorCanvas, image);
      const canvasPolygonHandler = new CanvasHandler(polygonCanvas, scaleHandler);
      canvasPolygonHandler.clearAll();
      canvasPolygonHandler.drawPolygon([...polygons, polygon.current]);
    }
  }, [polygons, scale]);
};
