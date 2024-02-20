import { Point } from '../types';

const OVERLAPPING_MARGIN = 3;
export const isBetween = (value: number, ref: number) => value >= ref - OVERLAPPING_MARGIN && value <= ref + OVERLAPPING_MARGIN;

export const areOverlappingPoints = (under: Point, upper: Point) => {
  const isXValid = isBetween(upper.x, under.x);
  const isYValid = isBetween(upper.y, under.y);

  return isXValid && isYValid;
};

export const getColorFromMain = (main: string) => {
  return {
    fillColor: `${main}40`,
    strokeColor: main,
  };
};

const distanceBetweenPoints = (pointA: Point, pointB: Point) => Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));

export const pointBelongsToOrIsClose = (currentPoint: Point, segment: [A: Point, B: Point]) => {
  const [A, B] = segment;

  const d1 = distanceBetweenPoints(currentPoint, A);
  const d2 = distanceBetweenPoints(currentPoint, B);
  const segmentDistance = distanceBetweenPoints(A, B);

  return Math.abs(d1 + d2 - segmentDistance) <= 1;
};

export const findMidpoint = (segment: [A: Point, B: Point]) => {
  const [A, B] = segment;

  return {
    x: (A.x + B.x) / 2,
    y: (A.y + B.y) / 2,
  } as Point;
};
