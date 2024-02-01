import { Polygone } from "../../types";

export interface AnnotationMainContextType {
  image: string;
  polygones?: Polygone[];
  height?: number;
  width?: number;
  addPolygone?: (polygone: Polygone) => void;
}
