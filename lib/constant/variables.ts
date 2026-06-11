import { getColorFromMain } from '../utilities/canvas-tools';

export const IMAGE_PADDING = 50;
export const SCALE_VALUE_QUERY_NAME = 'scale';
export const SCALE_DELTA_QUERY_NAME = 'scale-delta';
export const CURSOR_SIZE = 3;
export const DEFAULT_MAIN_COLOR = '#00ff00';
export const defaultPolygon = { ...getColorFromMain(DEFAULT_MAIN_COLOR), points: [], id: '', surface: 0, measurements: [] };
