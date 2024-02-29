import { FC, useRef } from 'react';
import { PolygonProviderProps } from '.';
import { defaultPolygon } from '../../constant';
import { PolygonContext } from '../../context/polygon';
import { Polygon } from '../../types';

export const PolygonProvider: FC<PolygonProviderProps> = props => {
  const { children, setPolygons: addPolygons, polygons, allowAnnotation } = props;
  const polygon = useRef<Polygon>(defaultPolygon);
  const isDrawing = useRef<boolean>(false);

  return <PolygonContext.Provider value={{ setPolygons: addPolygons, polygons, isDrawing, polygon, allowAnnotation }}>{children}</PolygonContext.Provider>;
};
