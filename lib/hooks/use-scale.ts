import { useEffect, useState } from "react";
import { useElementContext } from ".";
import { IMAGE_PADDING } from "../constant";

export const useScale = () => {
  const { image, containerRef } = useElementContext();
  const [defaultScale, setDefaultScale] = useState(1);
  const [containerSize, setContainerSize] = useState({
    containerWidth: 0,
    containerHeight: 0,
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

    const iwpDiff = Math.abs(containerWidth - iwp);
    const ihpDiff = Math.abs(containerHeight - ihp);

    if (
      containerHeight === 0 ||
      (containerWidth === 0 && image.src.length === 0)
    ) {
      return () => {};
    }

    if (iwpDiff > ihpDiff) {
      setDefaultScale(+(containerWidth / iwp).toFixed(2) - 0.1);
      return () => {};
    }

    setDefaultScale(+(containerHeight / ihp).toFixed(2) - 0.1);
    return () => {};
  }, [containerSize, image]);

  return {
    ...containerSize,
    defaultScale,
  };
};
