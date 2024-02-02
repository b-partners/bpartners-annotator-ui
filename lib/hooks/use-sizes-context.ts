import { useCallback, useContext } from "react";
import { SizesContext } from "..";

export const useSizesContext = () => {
  const { setScale, ...others } = useContext(SizesContext);

  const scale = useCallback(
    (toAdd: number) => {
      if (others.scale > 0.5 && others.scale < 2) {
        setScale(others.scale + toAdd);
      }
    },
    [others.scale, setScale],
  );

  const scaleUp = () => scale(0.2);
  const scaleDown = () => scale(-0.2);
  const scaleReste = () => scale(1 - others.scale);

  return { ...others, scaleUp, scaleDown, scaleReste };
};
