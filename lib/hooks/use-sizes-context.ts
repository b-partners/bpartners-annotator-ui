import { useContext } from 'react';
import { SizesContext, useElementContext } from '..';

export const useSizesContext = () => {
  const { setScale, canvasHeight, canvasWidth, scaleLimit, ...others } = useContext(SizesContext);
  const { image, containerRef } = useElementContext();

  const ch = Math.max(canvasHeight, others.containerHeight);
  const cw = Math.max(canvasWidth, others.containerWidth);

  const scaleUp = () => {
    if (others.scale < scaleLimit.max) {
      setScale(e => e + 0.2);
    }
  };

  const scaleDown = () => {
    if (parseFloat(others.scale.toFixed(2)) > scaleLimit.min) {
      setScale(e => e - 0.2);
    }
  };

  const scaleReset = () => {
    setScale(0);

    // Always recenter the image, even when there's no zoom to reset (scale already 0,
    // so the SizesProvider effect won't fire).
    const currentContainer = containerRef.current;
    if (currentContainer) {
      const maxX = currentContainer.scrollWidth - currentContainer.clientWidth;
      const maxY = currentContainer.scrollHeight - currentContainer.clientHeight;
      currentContainer.scrollTo({ left: maxX / 2, top: maxY / 2, behavior: 'instant' });
    }
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
