import { createContext } from 'react';
import { PolygonContextType } from '.';
import { defaultPolygon } from '../../constant';

export const PolygonContext = createContext<PolygonContextType>({
  addPolygon: () => {},
  polygons: [],
  isDrawing: false,
  polygon: defaultPolygon,
});
