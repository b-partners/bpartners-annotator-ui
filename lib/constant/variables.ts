import { getColorFromMain } from '../utilities/canvas-tools';

// Padding fed into the fit-scale computation (use-scale). Kept small so the image
// is not shrunk to make room for the surrounding margin.
export const IMAGE_PADDING = 50;
// Extra scrollable area (in image-pixel units) added around the image when sizing
// the canvas. Larger value => more room to pan/scroll around the image without
// affecting the displayed image size.
export const IMAGE_MARGIN = 600;
// Maximum zoom delta on top of the computed fit scale — the ceiling `scaleUp` stops at. Single
// source of truth shared by use-scale's scaleLimit.
export const MAX_ZOOM_DELTA = 2.6;
// Zoom delta the view opens at when it first focuses a polygon/marker on a fresh (default-storage)
// load. Kept below MAX_ZOOM_DELTA so the initial "x1.5" zoom leaves room to zoom in further by hand.
export const DEFAULT_ZOOM_DELTA = 0.4;
export const CURSOR_SIZE = 3;
export const DEFAULT_MAIN_COLOR = '#00ff00';
export const defaultPolygon = { ...getColorFromMain(DEFAULT_MAIN_COLOR), points: [], id: '', surface: 0, measurements: [] };
