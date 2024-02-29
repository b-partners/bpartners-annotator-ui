import { createContext } from 'react';
import { PolygonContextType } from '.';
import { defaultPolygon } from '../../constant';

export const PolygonContext = createContext<PolygonContextType>({
  addPolygon: () => {},
  polygons: [],
  isDrawing: { current: false },
  polygon: { current: defaultPolygon },
  allowAnnotation: false,
});
