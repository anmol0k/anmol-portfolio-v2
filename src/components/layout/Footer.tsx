"use client";

import { motion } from "motion/react";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative bg-[#050505] px-5 pb-8 pt-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1600px] border-t border-white/10 pt-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          {/* LEFT */}
          <div>
            <p className="text-lg font-medium tracking-[-0.03em] text-white/70">
              ANMOL<span className="text-white/20">/DEV</span>
            </p>

            <p className="mt-3 max-w-md text-sm leading-6 text-white/25">
              Designing and engineering digital experiences that feel useful,
              responsive and alive.
            </p>
          </div>

          {/* BACK TO TOP */}
          <motion.button
            type="button"
            onClick={scrollToTop}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            data-cursor="interactive"
            className="group flex w-fit items-center gap-3 text-sm text-white/35 transition hover:text-white"
          >
            Back to top

            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition group-hover:border-white/25">
              <ArrowUp size={15} />
            </span>
          </motion.button>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/15">
            © 2026 Anmol Kumar
          </p>

          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/15">
            ANMOL.OS / SYSTEM ONLINE
          </p>
        </div>
      </div>
    </footer>
  );
}