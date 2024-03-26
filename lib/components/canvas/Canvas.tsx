/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';
import { ScaleHandler, useCursorPolygon, useDrawStaticImage, useElementContext, useMeasurement, useSizesContext } from '../..';
import style from './style.module.css';

export const Canvas = () => {
  const { canvasHeight: height, canvasWidth: width, scale } = useSizesContext();
  const imageCanvasRef = useDrawStaticImage();
  const { cursorCanvasRef, polygonCanvasRef } = useCursorPolygon();
  const measurements = useMeasurement(cursorCanvasRef);
  const { image } = useElementContext();
  const sc = useMemo(() => {
    if (cursorCanvasRef.current) {
      return new ScaleHandler(cursorCanvasRef.current as HTMLCanvasElement, image);
    }
    return null;
  }, [image, cursorCanvasRef.current, scale]);

  return (
    <div style={{ width, height, position: 'relative' }}>
      <canvas className={style.canvas} ref={imageCanvasRef} width={width} height={height}></canvas>
      <canvas className={style.canvas} ref={polygonCanvasRef} width={width} height={height}></canvas>
      <canvas className={style.canvas} ref={cursorCanvasRef} width={width} height={height}></canvas>
      {sc &&
        measurements.map(({ position, unity, value }) => {
          const { x, y } = sc.getPhysicalPositionByPoint(position);
          return (
            unity === 'm' && (
              <span
                className={style.measurement}
                style={{
                  top: y,
                  left: x,
                }}
              >
                {value}
                {unity}
              </span>
            )
          );
        })}
    </div>
  );
};
