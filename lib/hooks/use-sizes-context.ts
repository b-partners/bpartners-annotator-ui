import { useContext } from 'react';
import { SizesContext, useElementContext } from '..';

export const useSizesContext = () => {
  const { setScale, resetView, canvasHeight, canvasWidth, scaleLimit, ...others } = useContext(SizesContext);
  const { image } = useElementContext();

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

  return {
    ...others,
    scaleUp,
    scaleDown,
    // Recenters through the SizesProvider effect (authoritative content size, suppressed scroll),
    // so it stays overlay-proof and re-focuses the marker on the next zoom — even at scale 0.
    scaleReste: resetView,
    canvasHeight: ch,
    canvasWidth: cw,
    imageWidth: image.width * others.scale,
    imageHeight: image.height * others.scale,
  };
};
