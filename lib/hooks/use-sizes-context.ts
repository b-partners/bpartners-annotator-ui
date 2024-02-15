import { useContext } from 'react';
import { SizesContext, useElementContext } from '..';

export const useSizesContext = () => {
  const { setScale, canvasHeight, canvasWidth, ...others } = useContext(SizesContext);
  const { image } = useElementContext();

  const ch = Math.max(canvasHeight, others.containerHeight);
  const cw = Math.max(canvasWidth, others.containerWidth);

  const scaleUp = () => {
    if (others.scale < 2) {
      setScale(e => e + 0.2);
    }
  };

  const scaleDown = () => {
    if (others.scale > 0.5) {
      setScale(e => e - 0.2);
    }
  };

  const scaleReset = () => {
    setScale(0);
  };

  return {
    ...others,
    scaleUp,
    scaleDown,
    scaleReste: scaleReset,
    canvasHeight: ch,
    canvasWidth: cw,
    imageWidth: image.width * others.scale,
    imageHeight: image.height * others.scale,
  };
};
