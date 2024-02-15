import { Dispatch, SetStateAction } from 'react';

export interface SizesContextType {
  containerWidth: number;
  containerHeight: number;
  canvasWidth: number;
  canvasHeight: number;
  scale: number;
  defaultScale: number;
  setScale: Dispatch<SetStateAction<number>>;
}
