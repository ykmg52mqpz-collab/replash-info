"use client";

import { MotionConfig } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

/**
 * App-wide motion config.
 * - reducedMotion="user": every framer-motion component automatically drops
 *   transform/position animation for users who prefer reduced motion, while
 *   keeping opacity/color. Single systemic fix — no per-component branching.
 * - default transition ease: the strong ease-out curve, so any transition
 *   without an explicit ease still feels deliberate.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: EASE_OUT }}>
      {children}
    </MotionConfig>
  );
}
