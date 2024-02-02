export interface Point {
  x: number;
  y: number;
}

export interface Polygon {
  fillColor: string;
  strokeColor: string;
  points: Point[];
}
