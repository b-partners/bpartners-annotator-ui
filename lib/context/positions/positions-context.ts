import { createContext } from 'react';
import { IPositionContext } from '.';

export const PositionsContext = createContext<IPositionContext>({ cursorPosition: { x: 0, y: 0 }, setCursorPosition() {} });
