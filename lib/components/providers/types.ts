import { ReactNode } from "react";
import { ElementContextType } from "../..";

export interface Children {
  children: ReactNode;
}

export interface ElementProviderProps extends Children, ElementContextType {}
export interface SizesProviderProps extends Children {}
