import { useEffect, useRef } from 'react';
import { CanvasHandler, ScaleHandler, useDrawStaticImage, useElementContext, usePositionsContext, useSizesContext } from '../..';
import style from './style.module.css';

export const Canvas = () => {
  const { canvasHeight: height, canvasWidth: width } = useSizesContext();
  const { setCursorPosition } = usePositionsContext();
  const { image } = useElementContext();
  const imageCanvasRef = useDrawStaticImage();
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);
  const polygonCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (cursorCanvasRef.current) {
      const cursorCanvas = cursorCanvasRef.current;
      const cursorCanvasHandler = new CanvasHandler(cursorCanvas);
      const sc = new ScaleHandler(cursorCanvas, image);
      cursorCanvas.addEventListener('mousemove', event => {
        cursorCanvasHandler.drawMouseCursor(sc.getPhysicalPositionByEvent(event), 'DEFAULT');
        setCursorPosition(sc.getRestrictedPhysicalPositionByEvent(event));
      });
    }
  }, [image, setCursorPosition]);

  return (
    <div style={{ width, height, position: 'relative' }}>
      <canvas className={style.canvas} ref={imageCanvasRef} width={width} height={height}></canvas>
      <canvas className={style.canvas} ref={polygonCanvasRef} width={width} height={height}></canvas>
      <canvas className={style.canvas} ref={cursorCanvasRef} width={width} height={height}></canvas>
    </div>
  );
};
