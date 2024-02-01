import { Polygone } from "../../types";

export interface AnnotationMainContextType {
  image: string;
  polygones?: Polygone[];
  addPolygone?: (polygone: Polygone) => void;
}
