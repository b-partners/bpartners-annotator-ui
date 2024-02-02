import { Polygon } from "../../types";

export interface AnnotationMainContextType {
  image: string;
  polygones?: Polygon[];
  height?: number;
  width?: number;
  addPolygone?: (polygone: Polygon) => void;
}
