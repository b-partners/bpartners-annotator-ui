import { createContext } from "react";
import { ElementContextType } from ".";

export const ElementContext = createContext<ElementContextType | null>(null);
