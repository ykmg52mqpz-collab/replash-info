/**
 * Shared motion tokens — single source of truth for easing curves.
 *
 * Built-in framer easings ("easeOut"/"easeInOut") are too weak for
 * deliberate motion; these strong curves start fast and settle cleanly.
 * The same tuples are used inline across the site's transitions.
 */

// Strong ease-out — entrances/exits (starts fast, feels responsive).
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

// Strong ease-in-out — on-screen movement / morphing.
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

// Duration scale (seconds) for framer transitions.
export const DURATION = {
  fast: 0.4,
  base: 0.6,
  slow: 0.8,
} as const;
