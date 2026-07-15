import { Point } from '../types';

export interface PersistedView {
  // Zoom delta on top of the computed fit scale (what `SizesProvider` keeps as `scale`).
  scale: number;
  // Viewport-center as a 0..1 fraction of the scrollable area (scale-independent).
  scrollPosition: Point | null;
  // Whether the user has performed their "first move" (a genuine pan/scroll). While false the
  // view is still auto-managed: every zoom re-focuses the polygon/marker. Once true, zooming
  // keeps the current center. Persisted so the mode survives a remount/tab switch.
  firstMove: boolean;
}

const isPoint = (value: unknown): value is Point => !!value && typeof (value as Point).x === 'number' && typeof (value as Point).y === 'number';

// Persists the per-instance zoom + scroll under a consumer-provided key so the view survives a
// remount/tab switch on its own — no consumer state wiring. Mirrors `UrlParams`, but keeps the
// state local to the browser instead of leaking it into the URL. All access is best-effort:
// localStorage can be unavailable (SSR, privacy mode) or over quota, so failures are swallowed.
export class LocalStorageView {
  static read(key: string): Partial<PersistedView> {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return {};
      const parsed = JSON.parse(raw) as Partial<PersistedView>;
      return {
        scale: typeof parsed.scale === 'number' ? parsed.scale : undefined,
        scrollPosition: isPoint(parsed.scrollPosition) ? parsed.scrollPosition : undefined,
        firstMove: typeof parsed.firstMove === 'boolean' ? parsed.firstMove : undefined,
      };
    } catch {
      return {};
    }
  }

  // Merge a patch into the stored view so writing only the scale doesn't drop the saved scroll
  // (and vice versa).
  static merge(key: string, patch: Partial<PersistedView>) {
    try {
      const next = { ...this.read(key), ...patch };
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // storage unavailable or over quota — persistence is best-effort, never throw on a draw path
    }
  }
}
