import { useCallback, useContext } from "react";
import { SizesContext, useElementContext } from "..";

export const useSizesContext = () => {
  const { setScale, canvasHeight, canvasWidth, ...others } =
    useContext(SizesContext);
  const { image } = useElementContext();

  const scale = useCallback(
    (toAdd: number) => {
      if (others.scale > 0.5 && others.scale < 2) {
        setScale(others.scale + toAdd);
      }
    },
    [others.scale, setScale],
  );

  const ch = Math.max(canvasHeight, others.containerHeight);
  const cw = Math.max(canvasWidth, others.containerWidth);

  const scaleUp = () => scale(0.2);
  const scaleDown = () => scale(-0.2);
  const scaleReste = () => scale(1 - others.scale);

  return {
    ...others,
    scaleUp,
    scaleDown,
    scaleReste,
    canvasHeight: ch,
    canvasWidth: cw,
    imageWidth: image.width * others.scale,
    imageHeight: image.height * others.scale,
  };
};
