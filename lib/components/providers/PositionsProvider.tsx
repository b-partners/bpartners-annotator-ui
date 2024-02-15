import { FC, useState } from 'react';
import { Children } from '.';
import { Point } from '../../types';
import { PositionsContext } from '../../context/positions';

export const PositionsProvider: FC<Children> = ({ children }) => {
  const [cursorPosition, setCursorPosition] = useState<Point>({ x: 0, y: 0 });

  return <PositionsContext.Provider value={{ cursorPosition, setCursorPosition }}>{children}</PositionsContext.Provider>;
};
