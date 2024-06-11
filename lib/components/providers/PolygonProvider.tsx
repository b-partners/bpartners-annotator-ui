import { FC, useRef } from 'react';
import { PolygonProviderProps } from '.';
import { defaultPolygon } from '../../constant';
import { PolygonContext } from '../../context/polygon';
import { Polygon } from '../../types';

export const PolygonProvider: FC<PolygonProviderProps> = props => {
  const { children, setPolygons, polygons, allowAnnotation, showLineSize, converterApiUrl, zoom, circleMarker } = props;
  const polygon = useRef<Polygon>(defaultPolygon);
  const isDrawing = useRef<boolean>(false);

  return (
    <PolygonContext.Provider value={{ setPolygons, polygons, converterApiUrl, isDrawing, polygon, allowAnnotation, showLineSize, zoom, marker: circleMarker }}>
      {children}
    </PolygonContext.Provider>
  );
};
