"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type MagneticButtonProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
};

export default function MagneticButton({
  children,
  className = "",
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, {
    stiffness: 180,
    damping: 18,
  });

  const springY = useSpring(y, {
    stiffness: 180,
    damping: 18,
  });

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = ref.current?.getBoundingClientRect();

    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((event.clientX - centerX) * 0.25);
    y.set((event.clientY - centerY) * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{
        x: springX,
        y: springY,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="interactive"
      className="inline-flex"
    >
      {href ? (
        <a href={href} className={className}>
          {children}
        </a>
      ) : (
        <button className={className}>{children}</button>
      )}
    </motion.div>
  );
}