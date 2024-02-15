import { useCursorPolygon, useDrawStaticImage, useSizesContext } from '../..';
import style from './style.module.css';

export const Canvas = () => {
  const { canvasHeight: height, canvasWidth: width } = useSizesContext();
  const imageCanvasRef = useDrawStaticImage();
  const { cursorCanvasRef, polygonCanvasRef } = useCursorPolygon();

  return (
    <div style={{ width, height, position: 'relative' }}>
      <canvas className={style.canvas} ref={imageCanvasRef} width={width} height={height}></canvas>
      <canvas className={style.canvas} ref={polygonCanvasRef} width={width} height={height}></canvas>
      <canvas className={style.canvas} ref={cursorCanvasRef} width={width} height={height}></canvas>
    </div>
  );
};
