import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { SizesProviderProps } from '.';
import { SizesContext, UrlParams, useElementContext, useScale } from '../..';
import { IMAGE_MARGIN, SCALE_DELTA_QUERY_NAME, SCROLL_LEFT_QUERY_NAME, SCROLL_TOP_QUERY_NAME } from '../../constant';

export const SizesProvider: FC<SizesProviderProps> = props => {
  const { children } = props;
  const { containerHeight, containerWidth, defaultScale, scaleLimit } = useScale();
  const { image, containerRef } = useElementContext();
  // Restore the user's manual zoom delta from the URL so it survives a remount;
  // it only changes again when the user uses the zoom buttons.
  const [scale, setScale] = useState(() => +(UrlParams.get(SCALE_DELTA_QUERY_NAME) ?? '0'));
  const [isMoving, setIsMoving] = useState(false);
  // Tracks the last zoom delta so we can tell a genuine user zoom (recenter the view)
  // apart from a remount or defaultScale settling (restore the saved scroll position).
  const prevScaleRef = useRef(scale);

  const canvasHeight = useMemo(() => Math.round((image.height + IMAGE_MARGIN) * (defaultScale + scale)), [defaultScale, image.height, scale]);

  const canvasWidth = useMemo(() => Math.round((image.width + IMAGE_MARGIN) * (defaultScale + scale)), [defaultScale, image.width, scale]);

  useEffect(() => {
    UrlParams.set('scale', (defaultScale + scale).toFixed(2));
    UrlParams.set(SCALE_DELTA_QUERY_NAME, scale.toFixed(2));

    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const maxX = currentContainer.scrollWidth - currentContainer.clientWidth;
    const maxY = currentContainer.scrollHeight - currentContainer.clientHeight;

    const userZoomed = prevScaleRef.current !== scale;
    prevScaleRef.current = scale;

    // On a genuine zoom, recenter on the image. Otherwise (mount/remount, or defaultScale
    // settling after the container is measured) restore the previously saved scroll so the
    // view doesn't jump back to center.
    const savedX = userZoomed ? null : UrlParams.get(SCROLL_LEFT_QUERY_NAME);
    const savedY = userZoomed ? null : UrlParams.get(SCROLL_TOP_QUERY_NAME);

    currentContainer.scrollTo({
      left: savedX !== null ? +savedX * maxX : maxX / 2,
      top: savedY !== null ? +savedY * maxY : maxY / 2,
      behavior: 'auto',
    });
  }, [defaultScale, scale, containerRef]);

  // Persist the scroll position to the URL (as a 0..1 fraction so it survives the canvas
  // being resized by zoom) so it can be restored after a remount, mirroring how scale is kept.
  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return () => {};

    const onScroll = () => {
      const maxX = currentContainer.scrollWidth - currentContainer.clientWidth;
      const maxY = currentContainer.scrollHeight - currentContainer.clientHeight;
      UrlParams.set(SCROLL_LEFT_QUERY_NAME, (maxX > 0 ? currentContainer.scrollLeft / maxX : 0).toFixed(4), true);
      UrlParams.set(SCROLL_TOP_QUERY_NAME, (maxY > 0 ? currentContainer.scrollTop / maxY : 0).toFixed(4), true);
    };

    currentContainer.addEventListener('scroll', onScroll);
    return () => currentContainer.removeEventListener('scroll', onScroll);
  }, [containerRef]);

  return (
    <SizesContext.Provider
      value={{
        canvasHeight,
        canvasWidth,
        containerHeight,
        containerWidth,
        defaultScale,
        scale: scale + defaultScale,
        setScale,
        scaleLimit,
        isMoving,
        toggleIsMoving: () => setIsMoving(p => !p),
      }}
    >
      {children}
    </SizesContext.Provider>
  );
};
