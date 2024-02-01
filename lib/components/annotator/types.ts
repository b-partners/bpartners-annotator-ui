import { ReactNode } from "react";
import { AnnotationMainContextType } from "../../context";

export interface AnnotationMainProviderProps extends AnnotationMainContextType {
  children: ReactNode;
}
