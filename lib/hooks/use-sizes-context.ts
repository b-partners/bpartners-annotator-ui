import { useContext } from 'react';
import { SizesContext, UrlParams, useElementContext, useScale } from '..';

export const useSizesContext = () => {
  const { setScale, canvasHeight, canvasWidth, scaleLimit, ...others } = useContext(SizesContext);
  const { image } = useElementContext();
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
