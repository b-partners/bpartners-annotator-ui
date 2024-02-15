import { FC } from 'react';
import { ElementProviderProps } from '.';
import { ElementContext } from '../..';

export const ElementProvider: FC<ElementProviderProps> = props => {
  const { containerRef, image, children } = props;

  return <ElementContext.Provider value={{ containerRef, image }}>{children}</ElementContext.Provider>;
};
