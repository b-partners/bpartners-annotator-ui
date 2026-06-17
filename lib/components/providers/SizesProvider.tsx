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
  // Tracks the last zoom delta so we can tell a genuine user zoom (keep the current view)
  // apart from a remount or defaultScale settling (restore the saved scroll position).
  const prevScaleRef = useRef(scale);
  // Content fraction (0..1) currently under the viewport center, kept up to date on scroll so
  // a zoom can keep that same part of the image centered instead of jumping to the image center.
  const viewCenterRef = useRef<{ x: number; y: number } | null>(null);

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

    if (userZoomed && scale !== 0) {
      // On a genuine zoom step, keep the part of the image under the viewport center fixed so the
      // zoom happens around the current view rather than jumping to the image center.
      const center = viewCenterRef.current;
      currentContainer.scrollTo({
        left: center ? center.x * currentContainer.scrollWidth - currentContainer.clientWidth / 2 : maxX / 2,
        top: center ? center.y * currentContainer.scrollHeight - currentContainer.clientHeight / 2 : maxY / 2,
        behavior: 'instant',
      });
      return;
    }

    if (userZoomed) {
      // Reset zoom (scale back to the default fit): recenter on the image.
      currentContainer.scrollTo({ left: maxX / 2, top: maxY / 2, behavior: 'instant' });
      return;
    }

    // Mount/remount, or defaultScale settling after the container is measured: restore the
    // previously saved scroll instantly (no animation) so the view doesn't jump back to center.
    const savedX = UrlParams.get(SCROLL_LEFT_QUERY_NAME);
    const savedY = UrlParams.get(SCROLL_TOP_QUERY_NAME);

    currentContainer.scrollTo({
      left: savedX !== null ? +savedX * maxX : maxX / 2,
      top: savedY !== null ? +savedY * maxY : maxY / 2,
      behavior: 'instant',
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
      viewCenterRef.current = {
        x: currentContainer.scrollWidth > 0 ? (currentContainer.scrollLeft + currentContainer.clientWidth / 2) / currentContainer.scrollWidth : 0.5,
        y: currentContainer.scrollHeight > 0 ? (currentContainer.scrollTop + currentContainer.clientHeight / 2) / currentContainer.scrollHeight : 0.5,
      };
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
