import mixpanel from "mixpanel-browser";

// Minimal, privacy-conscious analytics wrapper around Mixpanel.
//
// - Initializes once, only if a token is configured.
// - No-ops silently if the token is missing so the app keeps working.
// - Never pass transcripts, AI feedback text, emails, or other sensitive
//   data as event properties -- only coarse, non-identifying metadata.

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN as string | undefined;

let enabled = false;

if (MIXPANEL_TOKEN) {
  try {
    mixpanel.init(MIXPANEL_TOKEN, {
      autocapture: false,
      track_pageview: false,
      persistence: "localStorage",
    });
    enabled = true;
  } catch {
    enabled = false;
  }
} else {
  console.info("[analytics] VITE_MIXPANEL_TOKEN not set; analytics disabled.");
}

/** Associate subsequent events with the authenticated user's id. */
export function identifyUser(userId: string | null | undefined) {
  if (!enabled || !userId) return;
  try {
    mixpanel.identify(userId);
  } catch {
    // Analytics failures must never break the app.
  }
}

/** Track a product event with a small set of non-sensitive properties. */
export function trackEvent(name: string, properties?: Record<string, unknown>) {
  if (!enabled) return;
  try {
    mixpanel.track(name, properties);
  } catch {
    // Analytics failures must never break the app.
  }
}
