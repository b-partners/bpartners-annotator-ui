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
// Magnification the view opens at when it first focuses a polygon/marker on a fresh (default-storage)
// load, expressed RELATIVE to the fit scale (1 = fit, 1.5 = 50% closer). It must be a factor, not an
// absolute zoom delta: the fit scale (`defaultScale`) is inversely proportional to image size, so a
// fixed additive delta magnifies a large image far more than a small one — the auto-zoom then
// overshoots on big images and barely moves on small ones. Turned into a delta (defaultScale * (f-1))
// and clamped to MAX_ZOOM_DELTA at the call site, so the initial zoom leaves room to zoom in by hand.
export const DEFAULT_ZOOM_FACTOR = 1.5;
export const CURSOR_SIZE = 3;
export const DEFAULT_MAIN_COLOR = '#00ff00';
export const defaultPolygon = { ...getColorFromMain(DEFAULT_MAIN_COLOR), points: [], id: '', surface: 0, measurements: [] };
