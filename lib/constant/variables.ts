import { getColorFromMain } from '../utilities/canvas-tools';

export const IMAGE_PADDING = 50;
export const SCALE_VALUE_QUERY_NAME = 'scale';
export const CURSOR_SIZE = 3;

export const defaultPolygon = { ...getColorFromMain('#00ff00'), points: [], id: '' };
