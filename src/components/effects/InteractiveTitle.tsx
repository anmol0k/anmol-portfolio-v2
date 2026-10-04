"use client";

import { motion } from "motion/react";

type InteractiveTitleProps = {
  name?: string;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
};

export default function InteractiveTitle({
  name = "Anmol Kumar",
  onHoverStart,
  onHoverEnd,
}: InteractiveTitleProps) {
  const parts = name
    .trim()
    .toUpperCase()
    .split(/\s+/)
    .filter(Boolean);

  const firstName =
    parts[0] || "ANMOL";

  const lastName =
    parts.slice(1).join(" ") || "KUMAR";

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      data-cursor="interactive"
    >
      <div className="flex w-full flex-col">
        <div className="flex w-full overflow-hidden">
          {firstName.split("").map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              whileHover={{
                y: -8,
                scaleY: 1.06,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="inline-block flex-1 cursor-default select-none text-center text-[17vw] font-semibold leading-[0.82] tracking-[-0.08em] text-white sm:text-[16vw] lg:text-[11.5vw]"
            >
              {letter}
            </motion.span>
          ))}
        </div>

        <div className="flex w-full overflow-hidden">
          {lastName.split("").map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              whileHover={{
                y: 8,
                scaleY: 1.05,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="inline-block flex-1 cursor-default select-none text-center text-[17vw] font-semibold leading-[0.82] tracking-[-0.08em] text-white sm:text-[16vw] lg:text-[11.5vw]"
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}