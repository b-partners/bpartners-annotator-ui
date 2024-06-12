/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import {
  Measurement,
  Point,
  ScaleHandler,
  UrlParams,
  useCursorPolygon,
  useDrawStaticImage,
  useElementContext,
  useMeasurement,
  usePolygonContext,
  useSizesContext,
} from '../..';
import { MarkerIcon } from '../icons';
import style from './style.module.css';

export const Canvas = () => {
  const { canvasHeight: height, canvasWidth: width, scale } = useSizesContext();
  const { markerPosition } = usePolygonContext();
  const imageCanvasRef = useDrawStaticImage();
  const { cursorCanvasRef, polygonCanvasRef } = useCursorPolygon();
  const measurements = useMeasurement(cursorCanvasRef);
  const { image } = useElementContext();
  const [{ physicalMarker, physicalMeasurements }, setInfo] = useState<{ physicalMarker: Point | null; physicalMeasurements: Measurement[] }>({
    physicalMarker: null,
    physicalMeasurements: [],
  });

  useEffect(() => {
    if (cursorCanvasRef.current) {
      const sc = new ScaleHandler(cursorCanvasRef.current as HTMLCanvasElement, image);
      setInfo({
        physicalMeasurements: measurements.map(measurement => {
          const position = sc.getPhysicalPositionByPoint(measurement.position);
          return { ...measurement, position };
        }),
        physicalMarker: markerPosition ? sc.getPhysicalPositionByPoint(markerPosition) : null,
      });
    }
  }, [image, scale, measurements]);

  return (
    <div data-cy='annotator-canvas-container' style={{ width, height, position: 'relative' }}>
      <canvas data-cy='annotator-canvas-image' className={style.canvas} ref={imageCanvasRef} width={width} height={height}></canvas>
      <canvas data-cy='annotator-canvas-polygon' className={style.canvas} ref={polygonCanvasRef} width={width} height={height}></canvas>
      <canvas data-cy='annotator-canvas-cursor' className={style.canvas} ref={cursorCanvasRef} width={width} height={height}></canvas>
      {physicalMeasurements.map(({ position, unity, value }, k) => {
        const { x: left, y: top } = position;
        return (
          unity === 'm' && (
            <span key={k} className={style.measurement} style={{ top, left, fontSize: `${+(UrlParams.get('scale') || '1') * 5}px` }}>
              {value}
              {unity}
            </span>
          )
        );
      })}
      {physicalMarker && (
        <span
          className={style.marker}
          style={{
            top: physicalMarker.y,
            left: physicalMarker.x,
          }}
        >
          <MarkerIcon />
        </span>
      )}
    </div>
  );
};
