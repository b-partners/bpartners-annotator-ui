export interface Point {
  x: number;
  y: number;
}

export interface Polygone {
  fillColor: string;
  strokeColor: string;
  points: Point[];
}
