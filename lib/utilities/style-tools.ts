// Determines whether black or white text will have better contrast on the given background color.
// https://www.w3.org/WAI/GL/wiki/Relative_luminance
export function getContrastColor(backgroundColor: string) {
  try {
    const color = backgroundColor.slice(1);
    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4, 6), 16);

    const R_COEFFICIENT = 0.299;
    const G_COEFFICIENT = 0.587;
    const B_COEFFICIENT = 0.114;
    const LUMINANCE_THRESHOLD = 0.5;

    // Calculate luminance using the standard formula
    const luminance = (R_COEFFICIENT * r + G_COEFFICIENT * g + B_COEFFICIENT * b) / 255;
    return luminance > LUMINANCE_THRESHOLD ? '#000000' : '#FFFFFF';
  } catch (e) {
    console.error(e);
    return '#FFFFFF';
  }
}
