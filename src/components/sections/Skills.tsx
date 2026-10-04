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
  Braces,
  ChevronDown,
  Code2,
  Database,
  Server,
  Wrench,
} from "lucide-react";

import {
  SiBootstrap,
  SiCloudinary,
  SiCss,
  SiExpress,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiWordpress,
} from "react-icons/si";

type Skill = {
  _id: string;
  name: string;
  category: string;
  icon: string;
  order: number;
  isActive: boolean;
};

type DisplaySkill = {
  id: string;
  name: string;
  category: string;
  icon: string;
};

const skillDefinitions = [
  {
    names: ["Tailwind CSS", "Tailwind"],
    icon: "tailwindcss",
  },
  {
    names: ["REST APIs", "REST API"],
    icon: "restapi",
  },
  {
    names: ["React.js", "ReactJS", "React"],
    icon: "react",
  },
  {
    names: ["Next.js", "NextJS", "Next"],
    icon: "nextjs",
  },
  {
    names: ["Node.js", "NodeJS", "Node"],
    icon: "nodejs",
  },
  {
    names: ["Express.js", "ExpressJS", "Express"],
    icon: "express",
  },
  {
    names: ["JavaScript"],
    icon: "javascript",
  },
  {
    names: ["TypeScript"],
    icon: "typescript",
  },
  {
    names: ["PostgreSQL"],
    icon: "postgresql",
  },
  {
    names: ["MongoDB"],
    icon: "mongodb",
  },
  {
    names: ["Bootstrap"],
    icon: "bootstrap",
  },
  {
    names: ["Cloudinary"],
    icon: "cloudinary",
  },
  {
    names: ["WordPress"],
    icon: "wordpress",
  },
  {
    names: ["GitHub"],
    icon: "github",
  },
  {
    names: ["HTML5", "HTML"],
    icon: "html5",
  },
  {
    names: ["CSS3", "CSS"],
    icon: "css3",
  },
  {
    names: ["MySQL"],
    icon: "mysql",
  },
  {
    names: ["PHP"],
    icon: "php",
  },
  {
    names: ["Vercel"],
    icon: "vercel",
  },
  {
    names: ["Git"],
    icon: "git",
  },
];

const skillIconMap = {
  html5: SiHtml5,
  html: SiHtml5,

  css3: SiCss,
  css: SiCss,

  javascript: SiJavascript,
  js: SiJavascript,

  typescript: SiTypescript,
  ts: SiTypescript,

  react: SiReact,
  reactjs: SiReact,

  nextjs: SiNextdotjs,
  next: SiNextdotjs,

  bootstrap: SiBootstrap,

  tailwind: SiTailwindcss,
  tailwindcss: SiTailwindcss,

  nodejs: SiNodedotjs,
  node: SiNodedotjs,

  express: SiExpress,
  expressjs: SiExpress,

  php: SiPhp,

  mongodb: SiMongodb,
  mongo: SiMongodb,

  mysql: SiMysql,

  postgresql: SiPostgresql,
  postgres: SiPostgresql,

  wordpress: SiWordpress,

  git: SiGit,
  github: SiGithub,

  vercel: SiVercel,

  cloudinary: SiCloudinary,

  api: Braces,
  restapi: Braces,
  restapis: Braces,

  code: Code2,
  server: Server,
  database: Database,
  wrench: Wrench,
};

function normalizeIconName(
  value: string
) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s._-]/g, "");
}

function findTechnologyIcon(
  technology: string
) {
  const normalized =
    technology
      .trim()
      .toLowerCase();

  for (const definition of skillDefinitions) {
    if (
      definition.names.some(
        (name) =>
          name.toLowerCase() ===
          normalized
      )
    ) {
      return definition.icon;
    }
  }

  return "code";
}

function getSkillIcon(
  name: string,
  icon: string
) {
  /*
   * Prefer the technology name.
   * This means React will show React's
   * logo even if the old database
   * record contains "code".
   */
  const technologyIcon =
    findTechnologyIcon(name);

  const key =
    technologyIcon !== "code"
      ? technologyIcon
      : normalizeIconName(
          icon || "code"
        );

  return (
    skillIconMap[
      key as keyof typeof skillIconMap
    ] || Code2
  );
}

function splitCombinedSkill(
  skill: Skill
): DisplaySkill[] {
  const value =
    skill.name.trim();

  /*
   * First support clean comma-separated
   * records if you use them later.
   */
  if (value.includes(",")) {
    return value
      .split(",")
      .map((name) =>
        name.trim()
      )
      .filter(Boolean)
      .map(
        (
          name,
          index
        ) => ({
          id: `${skill._id}-${index}`,
          name,
          category:
            skill.category,
          icon:
            findTechnologyIcon(
              name
            ),
        })
      );
  }

  /*
   * Supports your existing records such as:
   *
   * HTML5 CSS3 JavaScript TypeScript
   * React.js Next.js Bootstrap Tailwind CSS
   */
  let remaining = value;

  const found:
    DisplaySkill[] = [];

  for (const definition of skillDefinitions) {
    for (const alias of definition.names) {
      const escaped =
        alias.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );

      const regex =
        new RegExp(
          `(^|\\s)${escaped}(?=\\s|$)`,
          "i"
        );

      if (regex.test(remaining)) {
        found.push({
          id: `${skill._id}-${found.length}`,
          name:
            definition.names[0],
          category:
            skill.category,
          icon:
            definition.icon,
        });

        remaining =
          remaining
            .replace(
              regex,
              " "
            )
            .replace(
              /\s+/g,
              " "
            )
            .trim();

        break;
      }
    }
  }

  if (found.length > 1) {
    return found;
  }

  return [
    {
      id: skill._id,
      name: skill.name,
      category:
        skill.category,
      icon:
        skill.icon ||
        findTechnologyIcon(
          skill.name
        ),
    },
  ];
}

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

        setSkills(
          data.skills || []
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

  const displaySkills =
    useMemo(() => {
      return skills.flatMap(
        splitCombinedSkill
      );
    }, [skills]);

  const categories =
    useMemo(() => {
      return Array.from(
        new Set(
          displaySkills.map(
            (skill) =>
              skill.category
          )
        )
      );
    }, [displaySkills]);

  const activeSkills =
    useMemo(() => {
      return displaySkills.filter(
        (skill) =>
          skill.category ===
          activeCategory
      );
    }, [
      displaySkills,
      activeCategory,
    ]);

  function getSkillsByCategory(
    category: string
  ) {
    return displaySkills.filter(
      (skill) =>
        skill.category ===
        category
    );
  }

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
    displaySkills.length ===
    0
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
                      size={18}
                      className={`shrink-0 text-white/30 transition-transform duration-300 ${
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
                    <div className="border border-white/10 bg-white/[0.02] p-6 sm:p-8">
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
  skills: DisplaySkill[];
}) {
  return (
    <>
      <div className="mb-7 flex items-center justify-between border-b border-white/10 pb-5">
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
          (skill) => {
            const Icon =
              getSkillIcon(
                skill.name,
                skill.icon
              );

            return (
              <div
                key={
                  skill.id
                }
                className="group flex min-h-[78px] items-center gap-4 border border-white/10 bg-black/20 px-4 py-4 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.025]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/10 bg-white/[0.02] text-cyan-400 transition group-hover:border-cyan-400/30">
                  <Icon
                    size={22}
                  />
                </div>

                <p className="min-w-0 text-sm font-medium text-white/75 transition group-hover:text-white">
                  {
                    skill.name
                  }
                </p>
              </div>
            );
          }
        )}
      </div>
    </>
  );
}