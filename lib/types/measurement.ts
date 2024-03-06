import { Point } from '.';

export interface Measurement {
  value: number;
  unity: 'm' | 'm²';
  position: Point;
}

export type Segment = [A: Point, B: Point];
