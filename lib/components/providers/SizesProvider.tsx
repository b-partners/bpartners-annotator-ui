import { Dispatch, FC, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { SizesProviderProps } from '.';
import { SizesContext, useElementContext, useScale } from '../..';
import { IMAGE_MARGIN } from '../../constant';
import { Point } from '../../types';
import { LocalStorageView } from '../../utilities';

export const SizesProvider: FC<SizesProviderProps> = props => {
  const { children, scale: controlledScale, onScaleChange, scrollPosition: controlledScroll, onScrollChange, storageKey, markerPosition } = props;
  const { containerHeight, containerWidth, defaultScale, scaleLimit } = useScale();
  const { image, containerRef } = useElementContext();

  // Saved zoom + scroll, read once from localStorage when a `storageKey` is given. This is the
  // durable persistence layer that lets the view survive a remount/tab switch on its own — the
  // consumer no longer has to thread `scale`/`scrollPosition` state back through props.
  const persisted = useMemo(() => (storageKey ? LocalStorageView.read(storageKey) : {}), [storageKey]);

  // Latest durable scroll target: an explicit controlled prop wins, else the localStorage value
  // (read fresh, so an image settling later restores the newest saved spot, not a stale ref).
  const readScrollTarget = (): Point | null => controlledScroll ?? (storageKey ? (LocalStorageView.read(storageKey).scrollPosition ?? null) : null);

  // Controlled when the consumer passes `scale`; otherwise the provider keeps its own zoom delta
  // in state, seeded from the persisted value so the saved zoom is restored on (re)mount.
  const isControlled = controlledScale !== undefined;
  const [internalScale, setInternalScale] = useState(persisted.scale ?? 0);
  const scale = isControlled ? controlledScale : internalScale;

  const setScale: Dispatch<SetStateAction<number>> = updater => {
    const next = typeof updater === 'function' ? (updater as (prev: number) => number)(scale) : updater;
    if (!isControlled) setInternalScale(next);
    if (storageKey) LocalStorageView.merge(storageKey, { scale: next });
    onScaleChange?.(next);
  };

  const [isMoving, setIsMoving] = useState(false);
  // Tracks the last zoom delta so we can tell a genuine user zoom (keep the current view)
  // apart from a remount or defaultScale settling (recenter on the image).
  const prevScaleRef = useRef(scale);
  // True once the user has genuinely panned the view (a real scroll, not one of our own
  // programmatic recenters). Used to decide whether the first zoom may focus the marker.
  const userMovedRef = useRef(false);
  // Whether a genuine user zoom has already happened. The very first zoom, on an un-panned
  // fresh view, focuses the location pointer (or the image center when there is none).
  const didFirstZoomRef = useRef(false);
  // Content fraction (0..1) currently under the viewport center, kept up to date on scroll so
  // a zoom can keep that same part of the image centered instead of jumping to the image center.
  // Seeded from the persisted (or controlled) scroll so a (re)mount restores the saved view.
  const viewCenterRef = useRef<Point | null>(controlledScroll ?? persisted.scrollPosition ?? null);
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

    // Authoritative content size: the canvas dimensions React knows this render — the same value
    // the canvas element is sized to. We deliberately do NOT read `scrollWidth/scrollHeight`: the
    // absolutely-positioned marker/measurement overlays lag a render behind a resize and transiently
    // inflate the container's scroll area, so a recenter computed against `scrollWidth` would scroll
    // too far and then strand off-center once the overlay catches up and the scroll clamps.
    const contentWidth = Math.max(canvasWidth, containerWidth);
    const contentHeight = Math.max(canvasHeight, containerHeight);
    const maxX = contentWidth - currentContainer.clientWidth;
    const maxY = contentHeight - currentContainer.clientHeight;

    // Scroll without letting the resulting `scroll` event echo back as a user move. The flag is
    // cleared on the next frame, after the scroll steps have run, so a genuine user scroll on a
    // later frame is still reported.
    const scrollTo = (center: { x: number; y: number } | null) => {
      suppressEmitRef.current = true;
      currentContainer.scrollTo({
        left: center ? center.x * contentWidth - currentContainer.clientWidth / 2 : maxX / 2,
        top: center ? center.y * contentHeight - currentContainer.clientHeight / 2 : maxY / 2,
        behavior: 'instant',
      });
      requestAnimationFrame(() => (suppressEmitRef.current = false));
    };

    // Fraction of the scrollable area currently under the viewport center — where we actually are.
    const view = {
      x: contentWidth > 0 ? (currentContainer.scrollLeft + currentContainer.clientWidth / 2) / contentWidth : 0.5,
      y: contentHeight > 0 ? (currentContainer.scrollTop + currentContainer.clientHeight / 2) / contentHeight : 0.5,
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
      // On the very first zoom of an untouched, fresh view, focus the location pointer: seed
      // the view center with the marker so the zoom brings it under the viewport center. With
      // no marker (or once the user has panned / a saved view exists), fall through to keeping
      // the current center — the image center on a fresh view.
      const freshView = !userMovedRef.current && !controlledScroll && !persisted.scrollPosition;
      if (!didFirstZoomRef.current && freshView && markerPosition) {
        // Marker center as a scale-independent fraction of the scrollable area. The image is
        // drawn centered in a canvas padded by IMAGE_MARGIN, so its top-left sits at
        // IMAGE_MARGIN/2 image units; the scale cancels between marker position and canvas size.
        viewCenterRef.current = {
          x: (markerPosition.x + IMAGE_MARGIN / 2) / (image.width + IMAGE_MARGIN),
          y: (markerPosition.y + IMAGE_MARGIN / 2) / (image.height + IMAGE_MARGIN),
        };
      }
      didFirstZoomRef.current = true;
      // Genuine zoom step: keep the part of the image under the viewport center fixed.
      scrollTo(viewCenterRef.current);
      return;
    }

    // Not a zoom — a tab switch, an image settling to a new size, or a mount. The persisted
    // scroll (localStorage, or the controlled prop) is the source of truth — never corrupted,
    // since our own scrolls don't echo into it — so re-apply it whenever we have drifted away.
    // Compared against the live viewport so an already-correct view (including our own echo) is
    // left alone, and skipped while the user pans so a lagging update can't fight the drag.
    const target = readScrollTarget();
    const EPSILON = 0.02;
    const differsFromView = !target || Math.abs(target.x - view.x) > EPSILON || Math.abs(target.y - view.y) > EPSILON;
    if (differsFromView && !isMoving) {
      viewCenterRef.current = target;
      scrollTo(target);
    }
    // `readScrollTarget` reads localStorage fresh on every run; deps cover the meaningful restore
    // triggers (mount, zoom, image settle via defaultScale, controlled-prop change, pan end).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultScale, scale, controlledScroll, storageKey, containerRef, isMoving]);

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
      // Ignore the scroll our own `scrollTo` just caused; only persist/surface genuine user
      // scrolls so a restore against a still-loading canvas can't overwrite the saved spot.
      if (suppressEmitRef.current) return;
      // A real user pan: from now on the first zoom keeps the current view instead of the marker.
      userMovedRef.current = true;
      if (storageKey) LocalStorageView.merge(storageKey, { scrollPosition: next });
      onScrollChange?.(next);
    };

    currentContainer.addEventListener('scroll', onScroll);
    return () => currentContainer.removeEventListener('scroll', onScroll);
  }, [containerRef, onScrollChange, storageKey]);

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
