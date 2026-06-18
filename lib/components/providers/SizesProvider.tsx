import { Dispatch, FC, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { SizesProviderProps } from '.';
import { SizesContext, useElementContext, useScale } from '../..';
import { IMAGE_MARGIN } from '../../constant';

export const SizesProvider: FC<SizesProviderProps> = props => {
  const { children, scale: controlledScale, onScaleChange, scrollPosition, onScrollChange } = props;
  const { containerHeight, containerWidth, defaultScale, scaleLimit } = useScale();
  const { image, containerRef } = useElementContext();

  // Controlled when the consumer passes `scale`; otherwise the provider keeps its own
  // zoom delta in state. Persistence (surviving a remount) is the consumer's job.
  const isControlled = controlledScale !== undefined;
  const [internalScale, setInternalScale] = useState(0);
  const scale = isControlled ? controlledScale : internalScale;

  const setScale: Dispatch<SetStateAction<number>> = updater => {
    const next = typeof updater === 'function' ? (updater as (prev: number) => number)(scale) : updater;
    if (!isControlled) setInternalScale(next);
    onScaleChange?.(next);
  };

  const [isMoving, setIsMoving] = useState(false);
  // Tracks the last zoom delta so we can tell a genuine user zoom (keep the current view)
  // apart from a remount or defaultScale settling (recenter on the image).
  const prevScaleRef = useRef(scale);
  // Content fraction (0..1) currently under the viewport center, kept up to date on scroll so
  // a zoom can keep that same part of the image centered instead of jumping to the image center.
  // Seeded from the consumer-persisted `scrollPosition` so a remount restores the saved view.
  const viewCenterRef = useRef<{ x: number; y: number } | null>(scrollPosition ?? null);

  const canvasHeight = useMemo(() => Math.round((image.height + IMAGE_MARGIN) * (defaultScale + scale)), [defaultScale, image.height, scale]);

  const canvasWidth = useMemo(() => Math.round((image.width + IMAGE_MARGIN) * (defaultScale + scale)), [defaultScale, image.width, scale]);

  // Live total scale, kept on a ref so the drawing/event handlers read the current value
  // without being torn down and rebuilt on every zoom step. Per-instance: no shared URL state.
  const scaleRef = useRef(defaultScale + scale);
  scaleRef.current = defaultScale + scale;

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const maxX = currentContainer.scrollWidth - currentContainer.clientWidth;
    const maxY = currentContainer.scrollHeight - currentContainer.clientHeight;

    const userZoomed = prevScaleRef.current !== scale;
    const isReset = userZoomed && scale === 0;
    prevScaleRef.current = scale;

    const center = viewCenterRef.current;

    if (center && !isReset) {
      // Keep the part of the image under the viewport center fixed. Covers a genuine zoom step
      // (zoom around the current view), a defaultScale settle/resize, and a remount that restored
      // a persisted `scrollPosition` — so the view never jumps back to center on a plain re-render.
      currentContainer.scrollTo({
        left: center.x * currentContainer.scrollWidth - currentContainer.clientWidth / 2,
        top: center.y * currentContainer.scrollHeight - currentContainer.clientHeight / 2,
        behavior: 'instant',
      });
      return;
    }

    // First layout with no saved view, or an explicit zoom reset: recenter on the image.
    currentContainer.scrollTo({ left: maxX / 2, top: maxY / 2, behavior: 'instant' });
  }, [defaultScale, scale, containerRef]);

  // Track the part of the image under the viewport center so a subsequent zoom can keep it
  // fixed. Kept in a ref (not the URL) so it stays isolated to this instance.
  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return () => {};

    const onScroll = () => {
      const next = {
        x: currentContainer.scrollWidth > 0 ? (currentContainer.scrollLeft + currentContainer.clientWidth / 2) / currentContainer.scrollWidth : 0.5,
        y: currentContainer.scrollHeight > 0 ? (currentContainer.scrollTop + currentContainer.clientHeight / 2) / currentContainer.scrollHeight : 0.5,
      };
      viewCenterRef.current = next;
      // Mirror how `scale` is surfaced: hand the new view fraction to the consumer so it can be
      // persisted and fed back through `scrollPosition` to restore the view on the next mount.
      onScrollChange?.(next);
    };

    currentContainer.addEventListener('scroll', onScroll);
    return () => currentContainer.removeEventListener('scroll', onScroll);
  }, [containerRef, onScrollChange]);

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
        scaleRef,
      }}
    >
      {children}
    </SizesContext.Provider>
  );
};
