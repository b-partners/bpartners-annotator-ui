import { FC, useRef } from 'react';
import { Children } from '.';
import { PositionsContext } from '../../context/positions';

export const PositionsProvider: FC<Children> = ({ children }) => {
  const xRef = useRef<HTMLParagraphElement>(null),
    yRef = useRef<HTMLParagraphElement>(null);

  return <PositionsContext.Provider value={{ xRef, yRef }}>{children}</PositionsContext.Provider>;
};
