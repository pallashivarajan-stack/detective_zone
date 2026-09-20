export const META_PIXEL_ID = "2533539463718226";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

/**
 * Safely trigger a Meta Pixel PageView event.
 * Guards against SSR, ad-blockers, and missing window.fbq.
 */
export function trackPixelPageView(): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    try {
      window.fbq("track", "PageView");
    } catch (e) {
      console.warn("[Meta Pixel] Failed to track PageView:", e);
    }
  }
}

/**
 * Safely trigger custom or standard Meta Pixel events (e.g., ViewContent, AddToCart, Purchase).
 */
export function trackPixelEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    try {
      if (params) {
        window.fbq("track", eventName, params);
      } else {
        window.fbq("track", eventName);
      }
    } catch (e) {
      console.warn(`[Meta Pixel] Failed to track event "${eventName}":`, e);
    }
  }
}
