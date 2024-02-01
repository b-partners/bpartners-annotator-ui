import { useContext } from "react";
import { AnnotationMainContext } from "../context";

export const useAnnotatorMainContext = () => {
  return useContext(AnnotationMainContext);
};
