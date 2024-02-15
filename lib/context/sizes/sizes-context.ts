import { createContext } from 'react';
import { SizesContextType } from '.';

export const SizesContext = createContext<SizesContextType>({
  canvasHeight: 0,
  canvasWidth: 0,
  containerHeight: 0,
  containerWidth: 0,
  scale: 1,
  defaultScale: 0,
  setScale: () => {},
});
