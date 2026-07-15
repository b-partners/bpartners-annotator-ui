/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import {
  DEFAULT_MAIN_COLOR,
  Measurement,
  Point,
  ScaleHandler,
  getContrastColor,
  useCursorPolygon,
  useDrawStaticImage,
  useElementContext,
  useMeasurement,
  usePolygonContext,
  useSizesContext,
} from '../..';
import { MarkerIcon } from '../icons';
import style from './style.module.css';
import './cursor-style.css';

export const Canvas = () => {
  const { canvasHeight: height, canvasWidth: width, scale, scaleRef, isMoving } = useSizesContext();
  const { markerPosition, polygons, zoom, imagePrecisionLevel = 5 } = usePolygonContext();
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
      const sc = new ScaleHandler(cursorCanvasRef.current, image, scaleRef);
      setInfo({
        physicalMeasurements: measurements.map(measurement => {
          const position = sc.getPhysicalPositionByPoint(measurement.position);
          return { ...measurement, position };
        }),
        physicalMarker: markerPosition ? sc.getPhysicalPositionByPoint(markerPosition) : null,
      });
    }
  }, [image, scale, measurements, markerPosition]);

  const canvasStyle = `${style.canvas} cursor-none`;

  useEffect(() => {
    const canvas = cursorCanvasRef.current;
    if (!canvas) return () => {};
    if (!isMoving) {
      canvas.classList.remove('cursor-grab');
      canvas.classList.add('cursor-none');
      return () => {};
    }
    canvas.classList.remove('cursor-none');
    canvas.classList.add('cursor-grab');
  }, [isMoving]);

  return (
    <div data-cy='annotator-canvas-container' style={{ width, height, position: 'relative' }}>
      <canvas data-cy='annotator-canvas-image' className={style.canvas} ref={imageCanvasRef} width={width} height={height}></canvas>
      <canvas data-cy='annotator-canvas-polygon' className={style.canvas} ref={polygonCanvasRef} width={width} height={height}></canvas>
      <canvas data-cy='annotator-canvas-cursor' className={canvasStyle} ref={cursorCanvasRef} width={width} height={height}></canvas>
      {physicalMeasurements.map(({ isInvisible = false, position, polygonId, unity, value }, k) => {
        const { x: left, y: top } = position;
        const currentPolygon = polygons.find(polygon => polygon.id === polygonId);
        const textColor = getContrastColor(currentPolygon?.strokeColor || DEFAULT_MAIN_COLOR);

        return (
          !isInvisible &&
          !currentPolygon?.isInvisible &&
          unity === 'm' && (
            <span
              key={`${value}-measure-${k}`}
              className={style.measurement}
              style={{
                color: textColor,
                backgroundColor: currentPolygon?.strokeColor,
                top,
                left,
                fontSize: `${scale * (zoom || 20 - (imagePrecisionLevel - 5))}px`,
                fontWeight: 'bold',
              }}
            >
              {value.toFixed(2)}
              {unity}
            </span>
          )
        );
      })}
      {physicalMarker && (
        <span
          data-cy='annotator-marker'
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
