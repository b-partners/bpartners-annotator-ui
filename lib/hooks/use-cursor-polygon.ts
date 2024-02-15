import { useEffect, useRef } from 'react';
import { useElementContext, usePositionsContext } from '.';
import { CanvasHandler, ScaleHandler } from '..';
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

      const cursorCanvasHandler = new CanvasHandler(cursorCanvas);
      const polygonCanvasHandler = new CanvasHandler(polygonCanvas);
      const sc = new ScaleHandler(cursorCanvas, image);

      cursorCanvas.addEventListener('mousemove', event => {
        cursorCanvasHandler.drawMouseCursor(sc.getPhysicalPositionByEvent(event), 'DEFAULT');
        setCursorPosition(sc.getRestrictedPhysicalPositionByEvent(event));
      });

      cursorCanvas.addEventListener('mousedown', event => {
        const { x, y } = sc.getRestrictedPhysicalPositionByEvent(event);
        const { x: physicalX, y: physicalY } = sc.getPhysicalPositionByEvent(event);

        if (!isAnnotating.current && x !== 0 && y !== 0) {
          isAnnotating.current = true;
          polygon.current = {
            fillColor: '#100f2e',
            strokeColor: '#000',
            points: [{ x: physicalX, y: physicalY }],
          };
        } else {
          polygon.current.points.push({ x: physicalX, y: physicalY });
        }

        polygon.current.points.forEach(polygonCanvasHandler.drawPoint.bind(polygonCanvasHandler));
      });
    }
  }, [image, setCursorPosition]);

  return { cursorCanvasRef, polygonCanvasRef };
};
