import debounce from 'debounce';
import { RefObject, useEffect, useMemo, useState } from 'react';
import { useElementContext, usePolygonContext } from '.';
import { Geojson, GeojsonMapper, Measurement, Polygon, PolygonMapper } from '..';
import { pointsToGeoPoints } from '../provider';

export const useMeasurement = (canvas: RefObject<HTMLCanvasElement>) => {
  const { polygons, showLineSize } = usePolygonContext();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const { image } = useElementContext();

  const setGeojsonDebounced = useMemo(
    () =>
      debounce(async (polygons: Polygon[]) => {
        if (polygons.length === 0) return;
        const currentGeoJson: Geojson = {
          filename: image.ariaLabel || '',
          regions: {},
          region_attributes: {
            label: 'pathway',
          },
        };
        polygons.forEach(polygon => {
          currentGeoJson.regions[polygon.id] = {
            shape_attributes: PolygonMapper.toGeoShapeAttributes(polygon),
          };
        });
        const res = await pointsToGeoPoints(currentGeoJson);
        if (res) {
          const measurements = GeojsonMapper.toMeasurements(res, polygons);
          setMeasurements(measurements);
        }
      }, 500),
    [image]
  );

  useEffect(() => {
    if (showLineSize) {
      setGeojsonDebounced(polygons);
    }
  }, [canvas, polygons, setGeojsonDebounced, showLineSize]);

  return measurements;
};
