import { createContext } from 'react';
import { PolygonContextType } from '.';

export const PolygonContext = createContext<PolygonContextType>({
  addPolygon: () => {},
  polygons: [],
  isDrawing: false,
  polygon: null,
});
