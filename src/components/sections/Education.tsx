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

type EducationItem = {
  _id: string;
  degree: string;
  institution: string;
  period: string;
  status: string;
  score: string;
  description: string;
  subjects: string[];
  order: number;
  isActive: boolean;
};

export default function Education() {
  const [education, setEducation] =
    useState<EducationItem[]>([]);

  const [activeId, setActiveId] =
    useState<string>("");

  const [
    mobileOpenId,
    setMobileOpenId,
  ] = useState<string>("");

  const [
    panelVisible,
    setPanelVisible,
  ] = useState(false);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadEducation() {
      try {
        const response =
          await fetch(
            "/api/education",
            {
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load education"
          );
        }

        const items:
          EducationItem[] =
          data.education || [];

        setEducation(items);
      } catch (error) {
        console.error(
          "Education fetch error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadEducation();
  }, []);

  const activeEducation =
    useMemo(() => {
      return education.find(
        (item) =>
          item._id === activeId
      );
    }, [education, activeId]);

  function handleDesktopEnter(
    item: EducationItem
  ) {
    setActiveId(item._id);
    setPanelVisible(true);
  }

  function handleDesktopSectionLeave() {
    setPanelVisible(false);
  }

  function toggleMobileItem(
    id: string
  ) {
    setMobileOpenId(
      (current) =>
        current === id ? "" : id
    );
  }

  if (loading) {
    return (
      <section
        id="education"
        className="border-t border-white/10 bg-[#050505] px-4 py-24 text-white sm:px-6 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-white/30">
            Loading education...
          </p>
        </div>
      </section>
    );
  }

  if (education.length === 0) {
    return null;
  }

  return (
    <section
      id="education"
      onMouseLeave={
        handleDesktopSectionLeave
      }
      className="border-t border-white/10 bg-[#050505] px-4 py-24 text-white sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-14">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-400">
            04 / Education
          </p>

          <h2 className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Academic foundations
            behind the work.
          </h2>
        </header>

        {/* MOBILE + TABLET */}
        <div className="space-y-3 lg:hidden">
          {education.map(
            (item, index) => {
              const open =
                mobileOpenId ===
                item._id;

              return (
                <div
                  key={item._id}
                  className="border border-white/10 bg-white/[0.01]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      toggleMobileItem(
                        item._id
                      )
                    }
                    className={`group flex w-full items-start justify-between gap-5 px-5 py-5 text-left transition ${
                      open
                        ? "bg-cyan-400/[0.05]"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] text-white/20">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </p>

                      <h3
                        className={`mt-2 text-lg font-medium transition ${
                          open
                            ? "text-cyan-400"
                            : "text-white/70"
                        }`}
                      >
                        {item.degree}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-white/35">
                        {
                          item.institution
                        }
                      </p>

                      <p className="mt-2 font-mono text-xs text-white/25">
                        {item.period}
                      </p>
                    </div>

                    <ChevronDown
                      size={18}
                      className={`mt-1 shrink-0 text-white/30 transition-transform duration-300 ${
                        open
                          ? "rotate-180 text-cyan-400"
                          : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence
                    initial={false}
                  >
                    {open && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.28,
                          ease: "easeOut",
                        }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/10 px-5 py-6">
                          <EducationDetails
                            item={item}
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
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
          <div className="space-y-3">
            {education.map(
              (item, index) => {
                const active =
                  item._id ===
                    activeId &&
                  panelVisible;

                return (
                  <button
                    key={item._id}
                    type="button"
                    onMouseEnter={() =>
                      handleDesktopEnter(
                        item
                      )
                    }
                    onFocus={() =>
                      handleDesktopEnter(
                        item
                      )
                    }
                    onClick={() =>
                      handleDesktopEnter(
                        item
                      )
                    }
                    className={`group relative w-full overflow-hidden border px-5 py-5 text-left transition ${
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

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-[10px] text-white/20">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </p>

                        <h3
                          className={`mt-2 text-lg font-medium transition ${
                            active
                              ? "text-cyan-400"
                              : "text-white/70 group-hover:text-white"
                          }`}
                        >
                          {
                            item.degree
                          }
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-white/35">
                          {
                            item.institution
                          }
                        </p>
                      </div>

                      <span className="shrink-0 font-mono text-xs text-white/25">
                        {
                          item.period
                        }
                      </span>
                    </div>
                  </button>
                );
              }
            )}
          </div>

          <div className="relative min-h-[420px]">
            <AnimatePresence
              mode="wait"
            >
              {panelVisible &&
                activeEducation && (
                  <motion.div
                    key={
                      activeEducation._id
                    }
                    initial={{
                      opacity: 0,
                      x: 48,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: 28,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                    className="sticky top-28"
                  >
                    <div className="border border-white/10 bg-white/[0.02] p-8">
                      <EducationDetails
                        item={
                          activeEducation
                        }
                      />
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>

            {!panelVisible && (
              <div className="flex min-h-[420px] items-center justify-center border border-dashed border-white/10 bg-white/[0.005]">
                <div className="max-w-xs text-center">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/20">
                    Explore Education
                  </p>

                  <p className="mt-3 text-sm leading-6 text-white/25">
                    Move your cursor
                    over an academic
                    record to inspect
                    its details.
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

function EducationDetails({
  item,
}: {
  item: EducationItem;
}) {
  return (
    <>
      <div className="border-b border-white/10 pb-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400">
          {item.status ||
            "Academic Record"}
        </p>

        <h3 className="mt-3 text-2xl font-medium sm:text-3xl">
          {item.degree}
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/45">
          {item.institution}
        </p>

        <p className="mt-2 font-mono text-xs text-white/25">
          {item.period}
        </p>
      </div>

      {item.score && (
        <div className="mt-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/25">
            Score / CGPA
          </p>

          <p className="mt-2 text-lg text-white/70">
            {item.score}
          </p>
        </div>
      )}

      {item.description && (
        <p className="mt-6 text-sm leading-7 text-white/45">
          {item.description}
        </p>
      )}

      {item.subjects.length >
        0 && (
        <div className="mt-7">
          <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-white/25">
            Focus Areas
          </p>

          <div className="flex flex-wrap gap-2">
            {item.subjects.map(
              (subject) => (
                <span
                  key={subject}
                  className="border border-white/10 px-3 py-2 text-xs text-white/40"
                >
                  {subject}
                </span>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}