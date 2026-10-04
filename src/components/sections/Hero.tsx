"use client";

import { motion } from "motion/react";
import { ArrowDownRight } from "lucide-react";

import InteractiveBackground from "@/components/effects/InteractiveBackground";
import InteractiveTitle from "@/components/effects/InteractiveTitle";
import MagneticButton from "@/components/ui/MagneticButton";
import { useProfile } from "@/hooks/useProfile";

export default function Hero() {
  const { profile } = useProfile();

  const name =
    profile.name || "Anmol Kumar";

  const title =
    profile.title || "Full Stack Developer";

  const shortBio =
    profile.shortBio ||
    "Building modern, interactive and scalable digital experiences.";

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] overflow-hidden bg-[#050505] text-white"
    >
      <InteractiveBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col px-4 pb-8 pt-28 sm:px-6 lg:px-10 lg:pt-32">
        <div className="flex min-w-0 flex-1 items-center">
          <div className="w-full min-w-0">
            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              data-cursor="interactive"
              className="mb-5 w-fit text-xs uppercase tracking-[0.3em] text-cyan-400 sm:text-sm"
            >
              {title}
            </motion.p>

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.1,
              }}
            >
              <InteractiveTitle
                name={name}
              />
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.25,
              }}
              className="mt-8 grid min-w-0 gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
            >
              <div>
                <p className="max-w-2xl text-base leading-7 text-white/45 sm:text-lg">
                  {shortBio}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      profile.availability
                        ? "bg-emerald-400"
                        : "bg-white/20"
                    }`}
                  />

                  <span className="text-xs uppercase tracking-[0.18em] text-white/35">
                    {profile.availability
                      ? "Available for opportunities"
                      : "Currently unavailable"}
                  </span>
                </div>
              </div>

              <MagneticButton>
                <a
                  href="#projects"
                  className="group flex items-center gap-3 border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white/60 transition hover:border-cyan-400/30 hover:text-white"
                  data-cursor="interactive"
                >
                  Explore Work

                  <ArrowDownRight
                    size={17}
                    className="transition group-hover:translate-x-1 group-hover:translate-y-1"
                  />
                </a>
              </MagneticButton>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1,
          }}
          className="mt-12 flex items-center justify-between border-t border-white/10 pt-5 text-[10px] uppercase tracking-[0.2em] text-white/20"
        >
          <span>ANMOL.OS / INTERFACE 01</span>

          <span className="hidden sm:block">
            Full Stack System
          </span>
        </motion.div>
      </div>
    </section>
  );
}