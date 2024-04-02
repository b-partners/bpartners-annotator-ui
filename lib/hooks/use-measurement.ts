import debounce from 'debounce';
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { useElementContext, usePolygonContext } from '.';
import { Geojson, GeojsonMapper, Measurement, Polygon, PolygonMapper } from '..';
import { pointsToGeoPoints } from '../provider';

export const useMeasurement = (canvas: RefObject<HTMLCanvasElement>) => {
  const { polygons, setPolygons, showLineSize, converterApiUrl } = usePolygonContext();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const { image } = useElementContext();
  const hasGeojsonGenerated = useRef(true);

  const setGeojsonDebounced = useMemo(
    () =>
      debounce(async (polygons: Polygon[]) => {
        if (polygons.length === 0) {
          setMeasurements([]);
          return;
        }
        const currentGeoJson: Geojson = {
          filename: image.ariaLabel || '',
          regions: {},
          region_attributes: {
            label: 'pathway',
          },
        };
        polygons.forEach(polygon => {
          if (!polygon.isInvisible) {
            currentGeoJson.regions[polygon.id] = {
              shape_attributes: PolygonMapper.toGeoShapeAttributes(polygon),
            };
          }
        });
        const res = await pointsToGeoPoints(converterApiUrl, currentGeoJson);
        if (res) {
          const measurements = GeojsonMapper.toMeasurements(res, polygons);
          setMeasurements(measurements);
          const newPolygons = polygons.map(polygon => {
            const currentPolygonSurface = measurements.find(measurement => measurement.unity === 'm²' && measurement.polygonId === polygon.id);
            const currentPolygonMeasurments = measurements.filter(measurement => measurement.polygonId === polygon.id);
            return { ...polygon, surface: currentPolygonSurface?.value, measurements: currentPolygonMeasurments };
          });
          setPolygons(newPolygons);
          hasGeojsonGenerated.current = false;
        }
      }, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [converterApiUrl, image.ariaLabel]
  );

  useEffect(() => {
    if (showLineSize && hasGeojsonGenerated.current) {
      setGeojsonDebounced(polygons);
    } else {
      hasGeojsonGenerated.current = true;
    }
  }, [canvas, polygons, setGeojsonDebounced, showLineSize]);

  return measurements;
};
