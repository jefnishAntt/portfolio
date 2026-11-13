"use client";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

/**
 * LazyMotion + the `m` components load only the animation features we use,
 * which keeps Framer Motion's share of the bundle small.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
