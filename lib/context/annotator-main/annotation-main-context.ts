import { createContext } from "react";
import { AnnotationMainContextType as TAnnotationMainContext } from "./types";

export const AnnotationMainContext = createContext<TAnnotationMainContext>({
  image: "",
});
