import { RefObject } from 'react';

export interface ElementContextType {
  image: HTMLImageElement;
  containerRef: RefObject<HTMLDivElement>;
}
