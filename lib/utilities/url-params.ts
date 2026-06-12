export class UrlParams {
  constructor() {}

  private static getUrl() {
    return new URL(window.location.href);
  }

  public static get(name: string) {
    return this.getUrl().searchParams.get(name);
  }

  // `replace` swaps pushState for replaceState — use it for high-frequency updates
  // (e.g. scroll) so the browser history isn't flooded with one entry per event.
  public static set(name: string, value: string, replace = false) {
    const url = this.getUrl();
    url.searchParams.set(name, value);
    if (replace) {
      window.history.replaceState({}, '', url);
    } else {
      window.history.pushState({}, '', url);
    }
  }
}
