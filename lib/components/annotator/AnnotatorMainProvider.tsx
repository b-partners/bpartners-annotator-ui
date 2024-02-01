import { FC } from "react";
import { AnnotationMainProviderProps } from "./types";
import { AnnotationMainContext } from "../../context";

export const AnnotatorMainProvider: FC<AnnotationMainProviderProps> = (
  props,
) => {
  const { children, ...others } = props;
  return (
    <AnnotationMainContext.Provider value={{ ...others }}>
      {children}
    </AnnotationMainContext.Provider>
  );
};
