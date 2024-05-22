import { useEffect, useState } from 'react';
import { useElementContext } from '.';
import { IMAGE_PADDING } from '../constant';

export const useScale = () => {
  const { image, containerRef } = useElementContext();
  const [defaultScale, setDefaultScale] = useState(1);
  const [containerSize, setContainerSize] = useState({
    containerWidth: 0,
    containerHeight: 0,
  });
  const [scaleLimit, setScaleLimit] = useState({
    max: 2,
    min: 0,
  });

  useEffect(() => {
    if (containerRef.current) {
      const { offsetHeight, offsetWidth } = containerRef.current;
      setContainerSize({
        containerHeight: offsetHeight,
        containerWidth: offsetWidth,
      });
    }
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
      max: defaultScale + 1.8,
      min: defaultScale - 0.2,
    });
  }, [containerSize, image, defaultScale]);

  return {
    ...containerSize,
    defaultScale,
    scaleLimit,
  };
};
