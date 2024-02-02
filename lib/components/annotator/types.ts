import { CSSProperties, ReactNode } from "react";
import { AnnotationMainContextType } from "../../context";
import { Polygon } from "../../types";

export interface AnnotationMainProviderProps extends AnnotationMainContextType {
  children: ReactNode;
}

export interface AnnotatorCanvasProps {
  width: CSSProperties["width"];
  height: CSSProperties["height"];
  image: string;
  addPolygone: (polygone: Polygon) => void;
  polygoneList: Polygon[];
}
