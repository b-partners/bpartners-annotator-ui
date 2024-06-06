/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';
import { ScaleHandler, UrlParams, useCursorPolygon, useDrawStaticImage, useElementContext, useMeasurement, useSizesContext } from '../..';
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
    <div data-cy='annotator-canvas-container' style={{ width, height, position: 'relative' }}>
      <canvas data-cy='annotator-canvas-image' className={style.canvas} ref={imageCanvasRef} width={width} height={height}></canvas>
      <canvas data-cy='annotator-canvas-polygon' className={style.canvas} ref={polygonCanvasRef} width={width} height={height}></canvas>
      <canvas data-cy='annotator-canvas-cursor' className={style.canvas} ref={cursorCanvasRef} width={width} height={height}></canvas>
      {sc &&
        measurements.map(({ position, unity, value }, k) => {
          const { x, y } = sc.getPhysicalPositionByPoint(position);
          return (
            unity === 'm' && (
              <span
                key={k}
                className={style.measurement}
                style={{
                  top: y,
                  left: x,
                  fontSize: `${+(UrlParams.get('scale') ?? '1') * 5}px`,
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
