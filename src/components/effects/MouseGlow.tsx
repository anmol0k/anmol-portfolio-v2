"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function MouseGlow() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-0 hidden h-[500px] w-[500px] rounded-full opacity-20 blur-[120px] md:block"
      animate={{
        x: position.x - 250,
        y: position.y - 250,
      }}
      transition={{
        type: "spring",
        stiffness: 60,
        damping: 20,
        mass: 0.4,
      }}
      style={{
        background:
          "radial-gradient(circle, rgba(0,229,255,0.55) 0%, rgba(81,56,255,0.28) 35%, transparent 70%)",
      }}
    />
  );
}