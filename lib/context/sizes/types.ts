import { Dispatch, SetStateAction } from 'react';

export type ScaleLimit = { max: number; min: number };

export interface SizesContextType {
  containerWidth: number;
  containerHeight: number;
  canvasWidth: number;
  canvasHeight: number;
  scale: number;
  defaultScale: number;
  setScale: Dispatch<SetStateAction<number>>;
  scaleLimit: ScaleLimit;
}
