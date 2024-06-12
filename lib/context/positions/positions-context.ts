import { createContext } from 'react';
import { IPositionContext } from '.';

export const PositionsContext = createContext<IPositionContext>({
  xRef: null as never,
  yRef: null as never,
});
