import { Point } from '.';

export interface Measurement {
  value: number;
  unity: 'm' | 'm²';
  position: Point;
  polygonId?: string;
  isInvisible?: boolean;
}

export type Segment = [A: Point, B: Point];
