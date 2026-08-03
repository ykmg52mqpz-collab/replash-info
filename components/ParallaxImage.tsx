"use client";

import { useRef, CSSProperties } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Full-bleed parallax background image.
 * Drop-in replacement for an `<img className="h-full w-full object-cover" .../>`
 * that used to sit inside an `absolute inset-0` container.
 *
 * The image drifts vertically as the section scrolls through the viewport.
 * Extra vertical overscan (-inset-y) guarantees no gap ever shows at the edges.
 * Respects prefers-reduced-motion (renders a static image).
 *
 * `strength` = how many % the image travels (top→bottom) across the scroll.
 */
export default function ParallaxImage({
  src,
  imgClassName = "h-full w-full object-cover",
  imgStyle,
  strength = 16,
}: {
  src: string;
  imgClassName?: string;
  imgStyle?: CSSProperties;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // As the section passes through the viewport (0→1), the image travels
  // from -strength% to +strength% → a continuous parallax drift.
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${strength}%`, `${strength}%`]
  );

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -inset-y-[30%] inset-x-0 will-change-transform"
        style={prefersReduced ? undefined : { y }}
      >
        <img src={src} alt="" className={imgClassName} style={imgStyle} />
      </motion.div>
    </div>
  );
}
