import { FC, useState } from "react";
import { SizesProviderProps } from ".";
import { SizesContext, useScale } from "../..";

export const SizesProvider: FC<SizesProviderProps> = (props) => {
  const { children } = props;
  const { containerHeight, containerWidth, defaultScale } = useScale();
  const [scale, setScale] = useState(1);

  return (
    <SizesContext.Provider
      value={{
        canvasHeight: containerHeight * defaultScale * scale,
        canvasWidth: containerWidth * defaultScale * scale,
        containerHeight,
        containerWidth,
        defaultScale,
        scale,
        setScale,
      }}
    >
      {children}
    </SizesContext.Provider>
  );
};
