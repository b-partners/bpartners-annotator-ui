import { useEffect, useState } from 'react';
import { useElementContext } from '.';
import { IMAGE_PADDING, MAX_ZOOM_DELTA } from '../constant';

export const useScale = () => {
  const { image, containerRef } = useElementContext();
  const [defaultScale, setDefaultScale] = useState(1);
  const [containerSize, setContainerSize] = useState({
    containerWidth: 0,
    containerHeight: 0,
  });
  const [scaleLimit, setScaleLimit] = useState({
    max: 3,
    min: 0,
  });

  // Keep the container size live. Measuring only once on mount left the fit scale (and the
  // centering that depends on it) stale whenever the container resized — a window resize, a
  // sidebar toggle, or any layout shift — leaving the image drifted off-center. A ResizeObserver
  // re-measures on every container size change; the equality guard avoids redundant re-renders.
  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return () => {};

    const measure = () => {
      const { offsetHeight, offsetWidth } = currentContainer;
      setContainerSize(prev =>
        prev.containerHeight === offsetHeight && prev.containerWidth === offsetWidth ? prev : { containerHeight: offsetHeight, containerWidth: offsetWidth }
      );
    };

    measure();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(currentContainer);
    return () => observer.disconnect();
  }, [containerRef]);

  useEffect(() => {
    const { containerHeight, containerWidth } = containerSize;
    const iwp = image.width + IMAGE_PADDING;
    const ihp = image.height + IMAGE_PADDING;

    if (containerHeight === 0 || (containerWidth === 0 && image.src.length === 0)) {
      return () => {};
    }

    const widthScale = +(containerWidth / iwp).toFixed(2);
    const heightScale = +(containerHeight / ihp).toFixed(2);

    setDefaultScale(widthScale > heightScale ? heightScale : widthScale);
    setScaleLimit({
      max: defaultScale + MAX_ZOOM_DELTA,
      min: defaultScale - 0.2,
    });
  }, [containerSize, image, defaultScale]);

  return {
    ...containerSize,
    defaultScale,
    scaleLimit,
  };
};
