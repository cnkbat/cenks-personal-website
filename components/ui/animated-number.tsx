"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

/**
 * Counts up the numeric part of a value string when scrolled into view,
 * preserving any prefix/suffix (e.g. "%100" → counts 0→100, "7/24" → 0→7/24).
 * Falls back to the raw value for non-numeric strings.
 */
export function AnimatedNumber({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const hasNumber = match !== null;
  const prefix = match ? match[1] : "";
  const target = match ? parseInt(match[2], 10) : 0;
  const suffix = match ? match[3] : "";
  const [display, setDisplay] = useState(0);

  // Depend only on stable primitives. Putting the `match` array (recreated every
  // render) in the deps made this effect re-run on each `setDisplay`, restarting
  // the count from 0 every frame.
  useEffect(() => {
    if (!inView || !hasNumber) return;
    const controls = animate(0, target, {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, hasNumber, target]);

  if (!hasNumber) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
