'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

/**
 * Page read-progress indicator. Uses Motion's scroll tracking bound to the
 * document, never a window scroll listener.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-accent motion-reduce:hidden"
    />
  );
}
