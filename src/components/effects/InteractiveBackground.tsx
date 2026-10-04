"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

export default function InteractiveBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 70,
    damping: 25,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 70,
    damping: 25,
  });

  const gridX = useTransform(
    smoothX,
    [-500, 500],
    [-20, 20]
  );

  const gridY = useTransform(
    smoothY,
    [-500, 500],
    [-20, 20]
  );

  const glowX = useTransform(
    smoothX,
    [-500, 500],
    [-80, 80]
  );

  const glowY = useTransform(
    smoothY,
    [-500, 500],
    [-80, 80]
  );

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      mouseX.set(event.clientX - centerX);
      mouseY.set(event.clientY - centerY);
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, [mouseX, mouseY]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Moving grid */}
      <motion.div
        style={{
          x: gridX,
          y: gridY,
        }}
        className="absolute -inset-20 opacity-[0.18]"
      >
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,0.06) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,0.06) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "70px 70px",
          }}
        />
      </motion.div>

      {/* Reactive glow */}
      <motion.div
        style={{
          x: glowX,
          y: glowY,
        }}
        className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,229,255,0.13) 0%, rgba(76,59,255,0.08) 40%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Top light */}
      <div
        className="absolute inset-x-0 top-0 h-[500px]"
        style={{
          background:
            "radial-gradient(circle at 50% -20%, rgba(255,255,255,0.10), transparent 65%)",
        }}
      />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#050505] to-transparent" />
    </div>
  );
}