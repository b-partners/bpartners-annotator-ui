export interface Point {
  x: number;
  y: number;
}

export interface Polygon {
  fillColor: string;
  strokeColor: string;
  points: Point[];
  isInvisible?: boolean;
}

export type MouseType = 'DEFAULT' | 'END' | 'UNDER_POINT' | 'ADD_POINT';