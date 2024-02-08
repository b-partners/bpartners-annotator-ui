import { useMemo } from "react";
import { useSizesContext } from ".";

export const useImagePosition = () => {
  const { canvasHeight, canvasWidth, imageHeight, imageWidth } =
    useSizesContext();

  const imageX = useMemo(
    () => Math.floor(Math.abs(canvasWidth - imageWidth) / 2),
    [canvasWidth, imageWidth],
  );

  const imageY = useMemo(
    () => Math.floor(Math.abs(canvasHeight - imageHeight) / 2),
    [canvasHeight, imageHeight],
  );

  return { imageX, imageY };
};
