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
  // Seeded from the consumer-persisted `scrollPosition` so a (re)mount restores the saved view.
  const viewCenterRef = useRef<{ x: number; y: number } | null>(scrollPosition ?? null);
  // Set around our own programmatic scrolls so the `scroll` event they fire is not echoed back
  // through `onScrollChange`. Without this, restoring against a still-loading image (the canvas
  // briefly has the previous tab's size) would emit a position measured on the wrong canvas and
  // overwrite the consumer's saved value, leaving the view stranded after the image settles.
  const suppressEmitRef = useRef(false);

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

    // Scroll without letting the resulting `scroll` event echo back as a user move. The flag is
    // cleared on the next frame, after the scroll steps have run, so a genuine user scroll on a
    // later frame is still reported.
    const scrollTo = (center: { x: number; y: number } | null) => {
      suppressEmitRef.current = true;
      currentContainer.scrollTo({
        left: center ? center.x * currentContainer.scrollWidth - currentContainer.clientWidth / 2 : maxX / 2,
        top: center ? center.y * currentContainer.scrollHeight - currentContainer.clientHeight / 2 : maxY / 2,
        behavior: 'instant',
      });
      requestAnimationFrame(() => (suppressEmitRef.current = false));
    };

    // Fraction of the scrollable area currently under the viewport center — where we actually are.
    const view = {
      x: currentContainer.scrollWidth > 0 ? (currentContainer.scrollLeft + currentContainer.clientWidth / 2) / currentContainer.scrollWidth : 0.5,
      y: currentContainer.scrollHeight > 0 ? (currentContainer.scrollTop + currentContainer.clientHeight / 2) / currentContainer.scrollHeight : 0.5,
    };

    const userZoomed = prevScaleRef.current !== scale;
    const isReset = userZoomed && scale === 0;
    prevScaleRef.current = scale;

    if (isReset) {
      // Explicit zoom reset: recenter on the image.
      viewCenterRef.current = null;
      scrollTo(null);
      return;
    }

    if (userZoomed) {
      // Genuine zoom step: keep the part of the image under the viewport center fixed.
      scrollTo(viewCenterRef.current);
      return;
    }

    // Not a zoom — a tab switch, an image settling to a new size, or a mount. The consumer's
    // `scrollPosition` is the source of truth (never corrupted, since our scrolls don't echo);
    // re-apply it whenever we have drifted away from it. Compared against the live viewport so an
    // already-correct view (including our own echo) is left alone, and skipped while the user pans
    // so a lagging update can't fight the drag.
    const target = scrollPosition ?? null;
    const EPSILON = 0.02;
    const differsFromView = !target || Math.abs(target.x - view.x) > EPSILON || Math.abs(target.y - view.y) > EPSILON;
    if (differsFromView && !isMoving) {
      viewCenterRef.current = target;
      scrollTo(target);
    }
  }, [defaultScale, scale, scrollPosition, containerRef, isMoving]);

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
      // Ignore the scroll our own `scrollTo` just caused; only surface genuine user scrolls so the
      // consumer can persist them and feed them back through `scrollPosition`.
      if (suppressEmitRef.current) return;
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
