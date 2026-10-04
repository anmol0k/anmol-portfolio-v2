"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "motion/react";

import { ChevronDown } from "lucide-react";

type Skill = {
  _id: string;
  name: string;
  category: string;
  icon: string;
  order: number;
  isActive: boolean;
};

export default function Skills() {
  const [skills, setSkills] =
    useState<Skill[]>([]);

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("");

  const [
    mobileOpenCategory,
    setMobileOpenCategory,
  ] = useState("");

  const [
    panelVisible,
    setPanelVisible,
  ] = useState(false);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadSkills() {
      try {
        const response =
          await fetch(
            "/api/skills",
            {
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load skills"
          );
        }

        const loadedSkills:
          Skill[] =
          data.skills || [];

        setSkills(
          loadedSkills
        );
      } catch (error) {
        console.error(
          "Skills fetch error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadSkills();
  }, []);

  const categories =
    useMemo(() => {
      return Array.from(
        new Set(
          skills.map(
            (skill) =>
              skill.category
          )
        )
      );
    }, [skills]);

  const activeSkills =
    useMemo(() => {
      return skills.filter(
        (skill) =>
          skill.category ===
          activeCategory
      );
    }, [
      skills,
      activeCategory,
    ]);

  function handleDesktopEnter(
    category: string
  ) {
    setActiveCategory(
      category
    );

    setPanelVisible(true);
  }

  function handleDesktopSectionLeave() {
    setPanelVisible(false);
  }

  function toggleMobileCategory(
    category: string
  ) {
    setMobileOpenCategory(
      (current) =>
        current === category
          ? ""
          : category
    );
  }

  function getSkillsByCategory(
    category: string
  ) {
    return skills.filter(
      (skill) =>
        skill.category ===
        category
    );
  }

  if (loading) {
    return (
      <section
        id="skills"
        className="relative border-t border-white/10 bg-[#050505] px-4 py-24 text-white sm:px-6 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-white/30">
            Loading technology
            system...
          </p>
        </div>
      </section>
    );
  }

  if (
    skills.length === 0
  ) {
    return null;
  }

  return (
    <section
      id="skills"
      onMouseLeave={
        handleDesktopSectionLeave
      }
      className="relative border-t border-white/10 bg-[#050505] px-4 py-24 text-white sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-14">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-400">
            02 / Technology
            System
          </p>

          <h2 className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Tools I use to turn
            ideas into working
            systems.
          </h2>
        </header>

        {/* MOBILE + TABLET */}
        <div className="space-y-3 lg:hidden">
          {categories.map(
            (
              category,
              index
            ) => {
              const open =
                mobileOpenCategory ===
                category;

              const categorySkills =
                getSkillsByCategory(
                  category
                );

              return (
                <div
                  key={
                    category
                  }
                  className="border border-white/10 bg-white/[0.01]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      toggleMobileCategory(
                        category
                      )
                    }
                    className={`flex w-full items-center justify-between gap-5 px-5 py-5 text-left transition ${
                      open
                        ? "bg-cyan-400/[0.05]"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <div>
                      <p className="font-mono text-[10px] text-white/20">
                        {String(
                          index +
                            1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </p>

                      <p
                        className={`mt-1 text-sm font-medium transition ${
                          open
                            ? "text-cyan-400"
                            : "text-white/60"
                        }`}
                      >
                        {
                          category
                        }
                      </p>

                      <p className="mt-2 text-xs text-white/25">
                        {
                          categorySkills.length
                        }{" "}
                        skill
                        {categorySkills.length ===
                        1
                          ? ""
                          : "s"}
                      </p>
                    </div>

                    <ChevronDown
                      size={
                        18
                      }
                      className={`shrink-0 text-white/30 transition-transform duration-300 ${
                        open
                          ? "rotate-180 text-cyan-400"
                          : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence
                    initial={
                      false
                    }
                  >
                    {open && (
                      <motion.div
                        initial={{
                          height:
                            0,
                          opacity:
                            0,
                        }}
                        animate={{
                          height:
                            "auto",
                          opacity:
                            1,
                        }}
                        exit={{
                          height:
                            0,
                          opacity:
                            0,
                        }}
                        transition={{
                          duration:
                            0.28,
                          ease:
                            "easeOut",
                        }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/10 px-5 py-6">
                          <SkillGrid
                            category={
                              category
                            }
                            skills={
                              categorySkills
                            }
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }
          )}
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10">
          <div className="space-y-2">
            {categories.map(
              (
                category,
                index
              ) => {
                const active =
                  category ===
                    activeCategory &&
                  panelVisible;

                const count =
                  getSkillsByCategory(
                    category
                  ).length;

                return (
                  <button
                    key={
                      category
                    }
                    type="button"
                    onMouseEnter={() =>
                      handleDesktopEnter(
                        category
                      )
                    }
                    onFocus={() =>
                      handleDesktopEnter(
                        category
                      )
                    }
                    onClick={() =>
                      handleDesktopEnter(
                        category
                      )
                    }
                    className={`group relative flex w-full items-center justify-between overflow-hidden border px-4 py-4 text-left transition ${
                      active
                        ? "border-cyan-400/30 bg-cyan-400/[0.05]"
                        : "border-white/10 bg-white/[0.01] hover:border-white/20"
                    }`}
                  >
                    <span
                      className={`absolute bottom-0 left-0 top-0 w-[2px] bg-cyan-400 transition-transform duration-300 ${
                        active
                          ? "scale-y-100"
                          : "scale-y-0"
                      }`}
                    />

                    <div>
                      <p className="font-mono text-[10px] text-white/20">
                        {String(
                          index +
                            1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </p>

                      <p
                        className={`mt-1 text-sm font-medium transition ${
                          active
                            ? "text-cyan-400"
                            : "text-white/60 group-hover:text-white"
                        }`}
                      >
                        {
                          category
                        }
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-mono text-xs text-white/20">
                        {String(
                          count
                        ).padStart(
                          2,
                          "0"
                        )}
                      </p>

                      <span
                        className={`mt-1 block text-xs transition ${
                          active
                            ? "text-cyan-400"
                            : "text-white/20"
                        }`}
                      >
                        →
                      </span>
                    </div>
                  </button>
                );
              }
            )}
          </div>

          <div className="relative min-h-[390px]">
            <AnimatePresence
              mode="wait"
            >
              {panelVisible &&
                activeCategory && (
                  <motion.div
                    key={
                      activeCategory
                    }
                    initial={{
                      opacity:
                        0,
                      x: 48,
                    }}
                    animate={{
                      opacity:
                        1,
                      x: 0,
                    }}
                    exit={{
                      opacity:
                        0,
                      x: 28,
                    }}
                    transition={{
                      duration:
                        0.3,
                      ease:
                        "easeOut",
                    }}
                    className="sticky top-28"
                  >
                    <div className="border border-white/10 bg-white/[0.02] p-8">
                      <SkillGrid
                        category={
                          activeCategory
                        }
                        skills={
                          activeSkills
                        }
                      />
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>

            {!panelVisible && (
              <div className="flex min-h-[390px] items-center justify-center border border-dashed border-white/10 bg-white/[0.005]">
                <div className="max-w-xs text-center">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/20">
                    Explore
                    Technology
                  </p>

                  <p className="mt-3 text-sm leading-6 text-white/25">
                    Move your
                    cursor over a
                    category to
                    inspect the
                    technologies
                    inside it.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillGrid({
  category,
  skills,
}: {
  category: string;
  skills: Skill[];
}) {
  return (
    <>
      <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/25">
            Active Category
          </p>

          <h3 className="mt-2 text-2xl font-medium">
            {category}
          </h3>
        </div>

        <span className="font-mono text-xs text-cyan-400">
          {String(
            skills.length
          ).padStart(
            2,
            "0"
          )}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {skills.map(
          (skill) => (
            <div
              key={
                skill._id
              }
              className="border border-white/10 bg-black/20 px-4 py-4 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.025]"
            >
              <p className="text-sm font-medium text-white/80">
                {
                  skill.name
                }
              </p>

              {skill.icon && (
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/20">
                  {
                    skill.icon
                  }
                </p>
              )}
            </div>
          )
        )}
      </div>
    </>
  );
}