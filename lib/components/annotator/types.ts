import { CSSProperties, ReactNode, RefObject } from 'react';
import { Measurement, Point, Polygon, PolygonColor } from '../../types';

interface PolygonSizeProps {
  imageName: string;
  showLineSize: boolean;
  converterApiUrl: string;
  showOnly?: boolean;
}

export interface ScaleCallbacks {
  scaleUp: () => void;
  scaleReste: () => void;
  scaleDown: () => void;
  toggleClickAction: () => void;
  clickActionValue: boolean;
  xRef: RefObject<HTMLParagraphElement>;
  yRef: RefObject<HTMLParagraphElement>;
}
export interface AnnotatorCanvasProps {
  width: CSSProperties['width'];
  height: CSSProperties['height'];
  image: string;
  setPolygons: (polygon: Polygon[]) => void;
  polygonList: Polygon[];
  zoom: number;
  allowAnnotation?: boolean;
  polygonLineSizeProps?: PolygonSizeProps;
  buttonsComponent?: (callback: ScaleCallbacks) => ReactNode;
  markerPosition?: Point;
  measurementMapper?: (measurement: Measurement, polygons?: Polygon[], index?: number) => Measurement;
  getNewPolygonColor?: (polygons: Polygon[]) => PolygonColor;
  pointRadius?: number;
  closeOnNear?: boolean;
  /**
   * Restricts pointer interaction to one mode:
   * - `true`  → only edit existing polygons (move a point, add a point on a segment).
   * - `false` → only draw new polygons.
   * Leave undefined to keep both interactions enabled.
   */
  edit?: boolean;
  imagePrecisionLevel?: number;
  /**
   * Controlled zoom delta, added on top of the internally computed fit-to-container scale
   * (0 means "just fit the image"). Provide this to own the zoom state from outside — e.g.
   * to keep two `AnnotatorCanvas` instances on the same screen zoomed independently.
   * When omitted the component manages its own zoom internally (uncontrolled).
   */
  scale?: number;
  /**
   * Called with the new zoom delta whenever the user zooms in/out or resets. Pair it with
   * `scale` for a controlled component, or use it on its own to persist the zoom level
   * (localStorage, URL, …) so it survives a remount.
   */
  onScaleChange?: (scale: number) => void;
}
