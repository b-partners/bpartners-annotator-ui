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
  // Clear the zoom and recenter on the image. Routed through the SizesProvider effect (never a
  // raw scrollWidth read or an un-suppressed scroll) so it stays overlay-proof and re-focuses the
  // marker on the next zoom.
  resetView: () => void;
  // Live total scale (defaultScale + zoom delta) for this instance. Passed to the drawing
  // handlers so coordinate math is per-instance instead of read from a shared URL param.
  scaleRef: MutableRefObject<number>;
}
