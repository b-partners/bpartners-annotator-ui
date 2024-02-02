import { createContext } from "react";
import { PolygonContextType } from ".";

export const PolygonContext = createContext<PolygonContextType>({
  addPolygons: () => {},
  polygons: [],
});
