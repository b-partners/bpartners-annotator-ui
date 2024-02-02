import { useEffect, useState } from "react";
import { useElementContext } from ".";
import { IMAGE_PADDING } from "../constant";

export const useScale = () => {
  const elements = useElementContext();
  const [defaultScale, setDefaultScale] = useState(1);
  const [containerSize, setContainerSize] = useState({
    containerWidth: 0,
    containerHeight: 0,
  });

  useEffect(() => {
    if (elements) {
      const { containerRef, image } = elements;
      if (containerRef && containerRef.current && image) {
        const { offsetHeight, offsetWidth } = containerRef.current;
        setContainerSize({
          containerHeight: offsetHeight,
          containerWidth: offsetWidth,
        });
      }
    }
  }, [elements]);

  useEffect(() => {
    const { containerHeight, containerWidth } = containerSize;
    if (containerHeight !== 0 && containerWidth !== 0 && elements?.image) {
      const yScale = (elements.image.width + IMAGE_PADDING) / containerWidth;
      const xScale = (elements.image.height + IMAGE_PADDING) / containerHeight;
      if (yScale < xScale) {
        setDefaultScale(xScale);
        return () => {};
      }
      setDefaultScale(yScale);
    }
  }, [containerSize, elements?.image]);

  return {
    ...containerSize,
    defaultScale,
  };
};
