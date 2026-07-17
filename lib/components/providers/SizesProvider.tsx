import { Dispatch, FC, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { SizesProviderProps } from '.';
import { SizesContext, useElementContext, useScale } from '../..';
import { DEFAULT_ZOOM_FACTOR, IMAGE_MARGIN } from '../../constant';
import { Point, Polygon } from '../../types';
import { LocalStorageView } from '../../utilities';

// Combined bounding-box center of every polygon, in logical (image-pixel) coordinates. Null when
// there is no polygon to focus. Used as the primary focus target (over the marker) on a fresh
// load and on every zoom while the view is still auto-managed.
const polygonsBoundingCenter = (polygons: Polygon[]): Point | null => {
  const points = polygons.flatMap(polygon => polygon.points);
  if (points.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const { x, y } of points) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
};

export const SizesProvider: FC<SizesProviderProps> = props => {
  const {
    children,
    scale: controlledScale,
    onScaleChange,
    scrollPosition: controlledScroll,
    onScrollChange,
    storageKey,
    markerPosition,
    polygons = [],
  } = props;
  const { containerHeight, containerWidth, defaultScale, isDefaultScaleReady, scaleLimit } = useScale();
  const { image, containerRef } = useElementContext();

  // Saved zoom + scroll + first-move flag, read once from localStorage when a `storageKey` is
  // given. This is the durable persistence layer that lets the view survive a remount/tab switch
  // on its own — the consumer no longer has to thread `scale`/`scrollPosition` state through props.
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

  // Whether the stored view is still at its default — nothing meaningful was ever persisted for
  // this instance. Requirement 1 (open zoomed-in and centered on the polygon/marker) only applies
  // to such a fresh view; once any zoom/scroll has been saved, the stored values drive the view.
  const storageDefault = useMemo(
    () => !controlledScroll && !persisted.scrollPosition && !persisted.firstMove && (persisted.scale === undefined || persisted.scale === 0),
    [controlledScroll, persisted]
  );

  const [isMoving, setIsMoving] = useState(false);
  // Mirror of `isMoving` on a ref so the restore effect can read the current mode as a guard
  // (skip a restore mid-pan) WITHOUT listing `isMoving` in its deps. Otherwise toggling move↔edit
  // re-runs the effect, which falls through to the restore branch and scrolls back to the stale
  // persisted target — undoing a focus zoom (that scroll was suppressed, so it never updated the
  // saved target). A mode switch must never move the image.
  const isMovingRef = useRef(isMoving);
  isMovingRef.current = isMoving;
  // Bumped by resetView() so an explicit reset always re-runs the effect below — even when the
  // zoom delta is already 0, where setScale(0) changes no state and would otherwise skip it.
  const [resetNonce, setResetNonce] = useState(0);
  const prevResetNonceRef = useRef(resetNonce);

  // Clear the zoom and recenter on the image. We only zero the zoom and bump the nonce here; the
  // effect does the actual recenter (and persists the reset, centered view — treating reset as a
  // first move) so it goes through the same authoritative-size, suppressed scroll path as every
  // other view change — never a raw scrollWidth read (the overlays inflate it) and never an
  // un-suppressed scroll that would be echoed back as a user move.
  const resetView = () => {
    setScale(0);
    setResetNonce(n => n + 1);
  };

  // Tracks the last zoom delta so we can tell a genuine user zoom (keep/refocus the view)
  // apart from a remount or defaultScale settling (restore the stored view).
  const prevScaleRef = useRef(scale);
  // The "first move" flag: true once the user has genuinely panned the view (a real scroll, not
  // one of our own programmatic recenters). While false the view is auto-managed — every zoom
  // re-focuses the polygon/marker (requirement 2); once true, a zoom keeps the current center
  // (requirement 3). Seeded from — and written back to — localStorage so it survives a remount.
  const firstMoveRef = useRef(persisted.firstMove ?? false);
  // Latches once the fresh-load focus zoom (requirement 1) has fired, so it happens exactly once
  // and never re-triggers after the user has taken over.
  const autoZoomedRef = useRef(false);
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

  // Authoritative content size (the canvas dimensions, floored at the viewport), kept on a ref so
  // the scroll listener measures the view fraction against the SAME basis the zoom effect restores
  // against. Reading the DOM `scrollWidth/Height` there instead would drift: the absolutely-
  // positioned marker/measurement overlays inflate the scroll area, so a fraction recorded against
  // `scrollWidth` is too small and the next zoom under-scrolls, sliding the view toward the corner.
  const contentSizeRef = useRef({ width: 0, height: 0 });
  contentSizeRef.current = { width: Math.max(canvasWidth, containerWidth), height: Math.max(canvasHeight, containerHeight) };

  // Live total scale, kept on a ref so the drawing/event handlers read the current value
  // without being torn down and rebuilt on every zoom step. Per-instance: no shared URL state.
  const scaleRef = useRef(defaultScale + scale);
  scaleRef.current = defaultScale + scale;

  // Focus target as a scale-independent fraction of the scrollable area: the polygon bbox center
  // when there is a polygon, else the marker, else null. The image is drawn centered in a canvas
  // padded by IMAGE_MARGIN, so a logical point p maps to (p + IMAGE_MARGIN/2) / (imageSize + MARGIN)
  // — the scale cancels between the point and the canvas size.
  const focusFraction = (): Point | null => {
    const center = polygonsBoundingCenter(polygons) ?? markerPosition ?? null;
    if (!center) return null;
    return {
      x: (center.x + IMAGE_MARGIN / 2) / (image.width + IMAGE_MARGIN),
      y: (center.y + IMAGE_MARGIN / 2) / (image.height + IMAGE_MARGIN),
    };
  };

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
    const resetRequested = prevResetNonceRef.current !== resetNonce;
    prevScaleRef.current = scale;
    prevResetNonceRef.current = resetNonce;

    // Explicit zoom reset: back to fit (delta 0) and recentered on the image. Treated as the
    // user's "first move" — the reset zoom (0) and the centered view are persisted so a remount
    // restores exactly this, and the next zoom keeps the center instead of re-focusing the
    // polygon/marker. Centering by size always lands the viewport center at the 0.5/0.5 fraction.
    if (resetRequested || (userZoomed && scale === 0)) {
      const centered = { x: 0.5, y: 0.5 };
      firstMoveRef.current = true;
      viewCenterRef.current = centered;
      if (storageKey) LocalStorageView.merge(storageKey, { scale: 0, scrollPosition: centered, firstMove: true });
      scrollTo(null);
      return;
    }

    // (1) Fresh storage: on the first load, focus the polygon (else the marker) by opening zoomed
    //     fully in and centered on it. With no such target, leave the zoom at fit and just center
    //     the image by its size. Fires once (autoZoomedRef), and only before any user zoom/pan —
    //     `polygons` is intentionally not an effect dep, so drawing a polygon never triggers this.
    if (storageDefault && !isControlled && !autoZoomedRef.current && !firstMoveRef.current && !userZoomed) {
      const focus = focusFraction();
      // Only fire the focus zoom once the fit scale has settled: the delta below is proportional to
      // `defaultScale`, so computing it from the placeholder (before the container is measured) would
      // over/under-zoom, and it latches (autoZoomedRef) so it can't self-correct on a later run.
      if (focus && isDefaultScaleReady) {
        autoZoomedRef.current = true;
        viewCenterRef.current = focus;
        // Persist the focus so a later image-settle (or a remount) restores this centered spot.
        if (storageKey) LocalStorageView.merge(storageKey, { scrollPosition: focus });
        scrollTo(focus);
        // Zoom in to the default level. The delta is proportional to the fit scale so the relative
        // magnification (DEFAULT_ZOOM_FACTOR) is the same for any image size — a fixed additive delta
        // would over-zoom large images (tiny fit scale) and under-zoom small ones. Clamped to the
        // zoom ceiling. This re-runs the effect at the new scale, which re-centers on the focus via
        // the userZoomed branch below now that the canvas has grown.
        const focusDelta = Math.min(defaultScale * (DEFAULT_ZOOM_FACTOR - 1), scaleLimit.max - defaultScale);
        setScale(focusDelta);
        return;
      }
      // No focus target (yet): center by size and leave the zoom alone. Not latched — a marker
      // arriving asynchronously later re-runs this effect and gets its focus zoom then.
      scrollTo(null);
      return;
    }

    // (2)/(3) A genuine user zoom step. While the view is still auto-managed (firstMove false),
    //     re-focus the polygon/marker on EVERY step (2) — re-seeding each time is what centers an
    //     edge target, since one low zoom can't scroll far enough and the clamped scroll would
    //     otherwise overwrite the aim. Once the user has moved (firstMove true), keep the part of
    //     the image under the viewport center fixed (3).
    if (userZoomed) {
      if (!firstMoveRef.current) {
        const focus = focusFraction();
        if (focus) viewCenterRef.current = focus;
        scrollTo(focus ?? viewCenterRef.current);
      } else {
        scrollTo(viewCenterRef.current);
      }
      return;
    }

    // (4) Not a zoom — a mount/pre-render, a tab switch, or the image settling to a new size.
    //     Restore the stored view (controlled prop or localStorage). While the view is still
    //     auto-managed (firstMove false) and nothing is stored, fall back to the focus target so a
    //     later image-settle keeps the polygon/marker centered instead of snapping back to the
    //     image center; with no focus this centers by size. Compared against the live viewport so
    //     an already-correct view (including our own echo) is left alone, and skipped while the
    //     user pans so a lagging update can't fight the drag.
    const target = readScrollTarget() ?? (firstMoveRef.current ? null : focusFraction());
    const EPSILON = 0.02;
    const differsFromView = !target || Math.abs(target.x - view.x) > EPSILON || Math.abs(target.y - view.y) > EPSILON;
    if (differsFromView && !isMovingRef.current) {
      viewCenterRef.current = target;
      scrollTo(target);
    }
    // `readScrollTarget`/`focusFraction` read localStorage & the latest props on every run; deps
    // cover the meaningful triggers (mount, zoom, image settle via defaultScale, container resize,
    // an async marker, controlled-prop change). `isMoving` is deliberately NOT a dep — it's read
    // via `isMovingRef` as a guard only, so toggling move↔edit doesn't re-run this effect and
    // restore to a stale target after a focus zoom.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultScale, isDefaultScaleReady, scale, controlledScroll, storageKey, containerRef, resetNonce, markerPosition, containerWidth, containerHeight]);

  // Track the part of the image under the viewport center so a subsequent zoom can keep it
  // fixed. Kept in a ref (not the URL) so it stays isolated to this instance.
  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return () => {};

    const onScroll = () => {
      const { width, height } = contentSizeRef.current;
      const next = {
        x: width > 0 ? (currentContainer.scrollLeft + currentContainer.clientWidth / 2) / width : 0.5,
        y: height > 0 ? (currentContainer.scrollTop + currentContainer.clientHeight / 2) / height : 0.5,
      };
      viewCenterRef.current = next;
      // Ignore the scroll our own `scrollTo` just caused; only persist/surface genuine user
      // scrolls so a restore against a still-loading canvas can't overwrite the saved spot.
      if (suppressEmitRef.current) return;
      // A real user pan — the "first move": from now on a zoom keeps the current view instead of
      // re-focusing the polygon/marker. Persisted alongside the scroll so it survives a remount.
      firstMoveRef.current = true;
      if (storageKey) LocalStorageView.merge(storageKey, { scrollPosition: next, firstMove: true });
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
        resetView,
        scaleRef,
      }}
    >
      {children}
    </SizesContext.Provider>
  );
};
