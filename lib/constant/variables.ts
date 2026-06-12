import { getColorFromMain } from '../utilities/canvas-tools';

// Padding fed into the fit-scale computation (use-scale). Kept small so the image
// is not shrunk to make room for the surrounding margin.
export const IMAGE_PADDING = 50;
// Extra scrollable area (in image-pixel units) added around the image when sizing
// the canvas. Larger value => more room to pan/scroll around the image without
// affecting the displayed image size.
export const IMAGE_MARGIN = 600;
export const SCALE_VALUE_QUERY_NAME = 'scale';
export const SCALE_DELTA_QUERY_NAME = 'scale-delta';
// Scroll position is persisted as a 0..1 fraction of the scrollable range so it stays
// correct across remounts and zoom changes (which resize the scrollable canvas).
export const SCROLL_LEFT_QUERY_NAME = 'scroll-x';
export const SCROLL_TOP_QUERY_NAME = 'scroll-y';
export const CURSOR_SIZE = 3;
export const DEFAULT_MAIN_COLOR = '#00ff00';
export const defaultPolygon = { ...getColorFromMain(DEFAULT_MAIN_COLOR), points: [], id: '', surface: 0, measurements: [] };
