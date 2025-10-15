import { createContext } from 'react';
import { PolygonContextType } from '.';
import { DEFAULT_MAIN_COLOR, defaultPolygon } from '../../constant';
import { getColorFromMain } from '../..';

export const PolygonContext = createContext<PolygonContextType>({
  setPolygons: () => {},
  getNewPolygonColor: () => getColorFromMain(DEFAULT_MAIN_COLOR),
  polygons: [],
  showLineSize: false,
  converterApiUrl: '',
  isDrawing: { current: false },
  polygon: { current: defaultPolygon },
  allowAnnotation: false,
  zoom: 20,
  closeOnNear: false,
});
