"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { useProfile } from "@/hooks/useProfile";

const storySteps = [
  {
    number: "01",
    title: "Started with interfaces",
    description:
      "Learning how structure, styling and interaction shape the way people experience software.",
  },
  {
    number: "02",
    title: "Wanted to know what happens behind them",
    description:
      "That curiosity pushed the work beyond frontend screens and into application logic and backend systems.",
  },
  {
    number: "03",
    title: "Data became part of the picture",
    description:
      "Databases, APIs and persistent application state became part of building complete products.",
  },
  {
    number: "04",
    title: "Now I build the whole experience",
    description:
      "Combining interface, backend, data and interaction into complete web systems.",
  },
];

export default function About() {
  const { profile } = useProfile();

  const [activeStep, setActiveStep] =
    useState(0);

  const active =
    storySteps[activeStep];

  return (
    <section
      id="about"
      className="relative border-t border-white/10 bg-[#050505] px-4 py-24 text-white sm:px-6 lg:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-14 lg:mb-20">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-400">
            01 / Identity
          </p>

          <h2 className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            More than a stack of technologies.
          </h2>

          {profile.about && (
            <p className="mt-6 max-w-3xl text-sm leading-7 text-white/45 sm:text-base">
              {profile.about}
            </p>
          )}
        </header>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          {/* LEFT SIDE */}
          <div>
            {profile.profileImage && (
              <div className="mb-8 overflow-hidden border border-white/10 bg-white/[0.02]">
                <img
                  src={profile.profileImage}
                  alt={
                    profile.name ||
                    "Profile"
                  }
                  className="h-[340px] w-full object-cover object-top sm:h-[420px] lg:h-[460px]"
                />
              </div>
            )}

            <div className="space-y-2">
              {storySteps.map(
                (step, index) => {
                  const isActive =
                    activeStep ===
                    index;

                  return (
                    <button
                      key={
                        step.number
                      }
                      type="button"
                      onClick={() =>
                        setActiveStep(
                          index
                        )
                      }
                      onMouseEnter={() =>
                        setActiveStep(
                          index
                        )
                      }
                      className={`group w-full border px-5 py-5 text-left transition ${
                        isActive
                          ? "border-cyan-400/30 bg-cyan-400/[0.05]"
                          : "border-white/10 bg-white/[0.01] hover:border-white/20"
                      }`}
                    >
                      <div className="flex gap-5">
                        <span className="font-mono text-[10px] text-white/20">
                          {
                            step.number
                          }
                        </span>

                        <div>
                          <h3
                            className={`text-base font-medium transition sm:text-lg ${
                              isActive
                                ? "text-cyan-400"
                                : "text-white/60 group-hover:text-white"
                            }`}
                          >
                            {
                              step.title
                            }
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-white/30 lg:hidden">
                            {
                              step.description
                            }
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden lg:block">
            <div className="sticky top-28 border border-white/10 bg-white/[0.02] p-8">
              <div className="flex items-start justify-between border-b border-white/10 pb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                    Identity Sequence
                  </p>

                  <motion.h3
                    key={
                      active.title
                    }
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="mt-4 max-w-xl text-3xl font-medium tracking-tight"
                  >
                    {
                      active.title
                    }
                  </motion.h3>
                </div>

                <span className="font-mono text-sm text-cyan-400">
                  {
                    active.number
                  }
                </span>
              </div>

              <motion.p
                key={
                  active.description
                }
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mt-7 max-w-xl text-sm leading-7 text-white/45"
              >
                {
                  active.description
                }
              </motion.p>

              <div className="mt-10 border-t border-white/10 pt-6">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/20">
                  Current Direction
                </p>

                <p className="mt-3 text-sm leading-6 text-white/45">
                  {profile.shortBio ||
                    "Building complete digital products across interface, application logic and data."}
                </p>
              </div>

              {profile.availability && (
                <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  <span className="text-xs uppercase tracking-[0.18em] text-white/35">
                    Available for
                    opportunities
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}