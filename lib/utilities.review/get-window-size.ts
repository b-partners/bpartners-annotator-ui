export const getWindowSize = (ratio = 100) => {
  if (window) {
    const { innerHeight, innerWidth } = window;
    return { height: (innerHeight * ratio) / 100, width: innerWidth };
  }
  return { height: 0, width: 0 };
};
