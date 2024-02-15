import { Dispatch, SetStateAction } from 'react';
import { Point } from '../../types';

export interface IPositionContext {
  cursorPosition: Point;
  setCursorPosition: Dispatch<SetStateAction<Point>>;
}
