/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import {
  DEFAULT_MAIN_COLOR,
  Measurement,
  Point,
  ScaleHandler,
  UrlParams,
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

export const Canvas = () => {
  const { canvasHeight: height, canvasWidth: width, scale } = useSizesContext();
  const { markerPosition, polygons } = usePolygonContext();
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
      const sc = new ScaleHandler(cursorCanvasRef.current, image);
      setInfo({
        physicalMeasurements: measurements.map(measurement => {
          const position = sc.getPhysicalPositionByPoint(measurement.position);
          return { ...measurement, position };
        }),
        physicalMarker: markerPosition ? sc.getPhysicalPositionByPoint(markerPosition) : null,
      });
    }
  }, [image, scale, measurements, markerPosition]);

  return (
    <div data-cy='annotator-canvas-container' style={{ width, height, position: 'relative' }}>
      <canvas data-cy='annotator-canvas-image' className={style.canvas} ref={imageCanvasRef} width={width} height={height}></canvas>
      <canvas data-cy='annotator-canvas-polygon' className={style.canvas} ref={polygonCanvasRef} width={width} height={height}></canvas>
      <canvas data-cy='annotator-canvas-cursor' className={style.canvas} ref={cursorCanvasRef} width={width} height={height}></canvas>
      {physicalMeasurements.map(({ isInvisible = false, position, polygonId, unity, value }, k) => {
        const { x: left, y: top } = position;
        const currentPolygon = polygons.find(polygon => polygon.id === polygonId);
        const textColor = getContrastColor(currentPolygon?.strokeColor || DEFAULT_MAIN_COLOR);

        return (
          !isInvisible &&
          unity === 'm' && (
            <span
              key={`${value}-measure-${k}`}
              className={style.measurement}
              style={{
                color: textColor,
                backgroundColor: currentPolygon?.strokeColor,
                top,
                left,
                fontSize: `${+(UrlParams.get('scale') ?? '1') * 20}px`,
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
