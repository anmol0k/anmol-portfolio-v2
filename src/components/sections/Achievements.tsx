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

import {
  Award,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

type AchievementItem = {
  _id: string;
  title: string;
  issuer: string;
  year: string;
  type: string;
  status: string;
  description: string;
  tags: string[];
  image: string;
  credentialUrl: string;
  order: number;
  isActive: boolean;
};

export default function Achievements() {
  const [achievements, setAchievements] =
    useState<AchievementItem[]>([]);

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
    async function loadAchievements() {
      try {
        const response = await fetch(
          "/api/achievements",
          {
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load achievements"
          );
        }

        const items: AchievementItem[] =
          data.achievements || [];

        setAchievements(items);
      } catch (error) {
        console.error(
          "Achievements fetch error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadAchievements();
  }, []);

  const activeAchievement =
    useMemo(() => {
      return achievements.find(
        (item) =>
          item._id === activeId
      );
    }, [
      achievements,
      activeId,
    ]);

  function handleDesktopEnter(
    item: AchievementItem
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
        id="achievements"
        className="border-t border-white/10 bg-[#050505] px-4 py-24 text-white sm:px-6 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-white/30">
            Loading achievements...
          </p>
        </div>
      </section>
    );
  }

  if (achievements.length === 0) {
    return null;
  }

  return (
    <section
      id="achievements"
      onMouseLeave={
        handleDesktopSectionLeave
      }
      className="border-t border-white/10 bg-[#050505] px-4 py-24 text-white sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-14">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-400">
            06 / Achievements
          </p>

          <h2 className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Credentials, recognition
            and verified milestones.
          </h2>
        </header>

        {/* MOBILE + TABLET */}
        <div className="space-y-3 lg:hidden">
          {achievements.map(
            (
              achievement,
              index
            ) => {
              const open =
                mobileOpenId ===
                achievement._id;

              return (
                <div
                  key={
                    achievement._id
                  }
                  className="border border-white/10 bg-white/[0.01]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      toggleMobileItem(
                        achievement._id
                      )
                    }
                    className={`flex w-full items-start justify-between gap-5 px-5 py-5 text-left transition ${
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
                        {
                          achievement.title
                        }
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-white/35">
                        {
                          achievement.issuer
                        }
                      </p>

                      {achievement.year && (
                        <p className="mt-2 font-mono text-xs text-white/25">
                          {
                            achievement.year
                          }
                        </p>
                      )}
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
                        <div className="border-t border-white/10">
                          <AchievementDetails
                            item={
                              achievement
                            }
                            mobile
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
            {achievements.map(
              (
                achievement,
                index
              ) => {
                const active =
                  achievement._id ===
                    activeId &&
                  panelVisible;

                return (
                  <button
                    key={
                      achievement._id
                    }
                    type="button"
                    onMouseEnter={() =>
                      handleDesktopEnter(
                        achievement
                      )
                    }
                    onFocus={() =>
                      handleDesktopEnter(
                        achievement
                      )
                    }
                    onClick={() =>
                      handleDesktopEnter(
                        achievement
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
                            index +
                              1
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
                            achievement.title
                          }
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-white/35">
                          {
                            achievement.issuer
                          }
                        </p>
                      </div>

                      <span className="shrink-0 font-mono text-xs text-white/25">
                        {achievement.year ||
                          "—"}
                      </span>
                    </div>
                  </button>
                );
              }
            )}
          </div>

          <div className="relative min-h-[520px]">
            <AnimatePresence
              mode="wait"
            >
              {panelVisible &&
                activeAchievement && (
                  <motion.div
                    key={
                      activeAchievement._id
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
                    <AchievementDetails
                      item={
                        activeAchievement
                      }
                    />
                  </motion.div>
                )}
            </AnimatePresence>

            {!panelVisible && (
              <div className="flex min-h-[520px] items-center justify-center border border-dashed border-white/10 bg-white/[0.005]">
                <div className="max-w-xs text-center">
                  <Award
                    size={30}
                    className="mx-auto text-white/10"
                  />

                  <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-white/20">
                    Explore Achievements
                  </p>

                  <p className="mt-3 text-sm leading-6 text-white/25">
                    Move your cursor
                    over a credential
                    to inspect the
                    record.
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

function AchievementDetails({
  item,
  mobile = false,
}: {
  item: AchievementItem;
  mobile?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden ${
        mobile
          ? ""
          : "border border-white/10 bg-white/[0.02]"
      }`}
    >
      <div className="relative aspect-[16/9] border-b border-white/10 bg-black/40">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Award
                size={34}
                className="mx-auto text-white/15"
              />

              <p className="mt-3 text-xs uppercase tracking-[0.25em] text-white/20">
                Verified Record
              </p>
            </div>
          </div>
        )}
      </div>

      <div
        className={
          mobile
            ? "px-5 py-6"
            : "p-8"
        }
      >
        <div className="border-b border-white/10 pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400">
              {item.type ||
                "Achievement"}
            </p>

            {item.status && (
              <span className="border border-white/10 px-2 py-1 text-[9px] uppercase tracking-wider text-white/40">
                {
                  item.status
                }
              </span>
            )}
          </div>

          <h3 className="mt-3 text-2xl font-medium sm:text-3xl">
            {item.title}
          </h3>

          <p className="mt-2 text-sm text-white/45">
            {item.issuer}
          </p>

          {item.year && (
            <p className="mt-2 font-mono text-xs text-white/25">
              {item.year}
            </p>
          )}
        </div>

        {item.description && (
          <p className="mt-6 text-sm leading-7 text-white/45">
            {
              item.description
            }
          </p>
        )}

        {item.tags.length >
          0 && (
          <div className="mt-7">
            <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-white/25">
              Tags
            </p>

            <div className="flex flex-wrap gap-2">
              {item.tags.map(
                (tag) => (
                  <span
                    key={tag}
                    className="border border-white/10 px-3 py-2 text-xs text-white/40"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {item.credentialUrl && (
          <div className="mt-8">
            <a
              href={
                item.credentialUrl
              }
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-cyan-400 px-4 py-3 text-xs font-medium text-black transition hover:bg-cyan-300"
            >
              <ExternalLink
                size={14}
              />
              View Credential
            </a>
          </div>
        )}
      </div>
    </div>
  );
}