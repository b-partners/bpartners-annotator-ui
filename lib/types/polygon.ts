import { Measurement } from '.';

export interface Point {
  x: number;
  y: number;
}

export interface PolygonColor {
  fillColor: string;
  strokeColor: string;
}

export interface Polygon extends PolygonColor {
  id: string;
  points: Point[];
  isInvisible?: boolean;
  surface?: number;
  measurements?: Measurement[];
  lineIndividualColor?: boolean;
}

export type MouseType = 'DEFAULT' | 'END' | 'UNDER_POINT' | 'ADD_POINT' | 'CROSS';
