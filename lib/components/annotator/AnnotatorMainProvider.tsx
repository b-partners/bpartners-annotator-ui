import { FC } from "react";
import { AnnotationMainProviderProps } from "./types";
import { AnnotationMainContext } from "../../context";
import { getWindowSize } from "../..";

export const AnnotatorMainProvider: FC<AnnotationMainProviderProps> = (
  props,
) => {
  const { children, height, width, ...others } = props;

  const { height: h, width: w } = getWindowSize(70);

  return (
    <AnnotationMainContext.Provider
      value={{ ...others, height: height || h, width: width || w }}
    >
      {children}
    </AnnotationMainContext.Provider>
  );
};
