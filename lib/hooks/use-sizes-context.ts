import { useContext } from 'react';
import { SizesContext, UrlParams, useElementContext, useScale } from '..';
import { SCROLL_LEFT_QUERY_NAME, SCROLL_TOP_QUERY_NAME } from '../constant';

export const useSizesContext = () => {
  const { setScale, canvasHeight, canvasWidth, scaleLimit, ...others } = useContext(SizesContext);
  const { image, containerRef } = useElementContext();
  const { defaultScale } = useScale();

  const ch = Math.max(canvasHeight, others.containerHeight);
  const cw = Math.max(canvasWidth, others.containerWidth);

  const scaleUp = () => {
    if (others.scale < scaleLimit.max) {
      setScale(e => {
        const currentScale = e + 0.2;
        UrlParams.set('scale', (defaultScale + currentScale).toFixed(2));
        return currentScale;
      });
    }
  };

  const scaleDown = () => {
    if (parseFloat(others.scale.toFixed(2)) > scaleLimit.min) {
      setScale(e => {
        const currentScale = e - 0.2;
        UrlParams.set('scale', (defaultScale + currentScale).toFixed(2));
        return currentScale;
      });
    }
  };

  const scaleReset = () => {
    UrlParams.set('scale', defaultScale.toFixed(2));
    setScale(0);

    // Always recenter the image, even when there's no zoom to reset (scale already 0,
    // so the SizesProvider effect won't fire). Clear the saved scroll so it sticks.
    UrlParams.set(SCROLL_LEFT_QUERY_NAME, '0.5', true);
    UrlParams.set(SCROLL_TOP_QUERY_NAME, '0.5', true);

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
