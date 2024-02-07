import { FC, useEffect, useMemo, useState } from "react";
import { SizesProviderProps } from ".";
import { SizesContext, UrlParams, useElementContext, useScale } from "../..";
import { IMAGE_PADDING } from "../../constant";

export const SizesProvider: FC<SizesProviderProps> = (props) => {
  const { children } = props;
  const { containerHeight, containerWidth, defaultScale } = useScale();
  const { image } = useElementContext();
  const [scale, setScale] = useState(0);

  const canvasHeight = useMemo(
    () => Math.round((image.height + IMAGE_PADDING) * (defaultScale + scale)),
    [defaultScale, image.height, scale],
  );

  const canvasWidth = useMemo(
    () => Math.round((image.width + IMAGE_PADDING) * (defaultScale + scale)),
    [defaultScale, image.width, scale],
  );

  useEffect(() => {
    UrlParams.set("scale", `${defaultScale + scale}`);
  }, [defaultScale, scale]);

  return (
    <SizesContext.Provider
      value={{
        canvasHeight,
        canvasWidth,
        containerHeight,
        containerWidth,
        defaultScale,
        scale: scale + defaultScale,
        setScale,
      }}
    >
      {children}
    </SizesContext.Provider>
  );
};
