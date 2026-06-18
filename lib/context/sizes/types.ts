import { Dispatch, MutableRefObject, SetStateAction } from 'react';

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
  isMoving: boolean;
  toggleIsMoving: () => void;
  // Live total scale (defaultScale + zoom delta) for this instance. Passed to the drawing
  // handlers so coordinate math is per-instance instead of read from a shared URL param.
  scaleRef: MutableRefObject<number>;
}
