"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";

export default function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const cursorX = useSpring(mouseX, {
    stiffness: 500,
    damping: 35,
  });

  const cursorY = useSpring(mouseY, {
    stiffness: 500,
    damping: 35,
  });

  const ringX = useSpring(mouseX, {
    stiffness: 150,
    damping: 20,
  });

  const ringY = useSpring(mouseY, {
    stiffness: 150,
    damping: 20,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);

      setIsVisible(true);

      const element = event.target as HTMLElement;

      setIsHovering(
        Boolean(
          element.closest(
            "a, button, [data-cursor='interactive']"
          )
        )
      );
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
      document.removeEventListener(
        "mouseenter",
        handleMouseEnter
      );
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[99999] hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 0.5 : 1,
        }}
      >
        <div className="-ml-1.5 -mt-1.5 h-3 w-3 rounded-full bg-white" />
      </motion.div>

      {/* Outer cursor ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[99998] hidden md:block"
        style={{
          x: ringX,
          y: ringY,
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 1.8 : 1,
        }}
        transition={{
          scale: {
            duration: 0.2,
          },
        }}
      >
        <div className="-ml-5 -mt-5 h-10 w-10 rounded-full border border-white/40" />
      </motion.div>
    </>
  );
}