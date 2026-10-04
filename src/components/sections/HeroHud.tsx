"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  Code2,
  Cpu,
  Database,
  FolderOpen,
  Layers3,
  MapPin,
  Radio,
  Sparkles,
  UserRound,
} from "lucide-react";

import MagneticButton from "@/components/ui/MagneticButton";

export type HeroHudMode =
  | "default"
  | "identity"
  | "stack"
  | "projects";

type HeroHudProps = {
  mode: HeroHudMode;
};

const defaultItems = [
  {
    icon: Sparkles,
    title: "Interactive Experiences",
    value: "UI / Motion / Web",
  },
  {
    icon: Cpu,
    title: "Full Stack Systems",
    value: "React / Next / MongoDB",
  },
  {
    icon: Radio,
    title: "Creative Engineering",
    value: "Frontend / APIs / UX",
  },
];

const stackItems = [
  {
    icon: Code2,
    title: "Frontend",
    value: "React / Next.js / TypeScript",
  },
  {
    icon: Layers3,
    title: "Backend",
    value: "Node.js / APIs / Server Logic",
  },
  {
    icon: Database,
    title: "Database",
    value: "MongoDB / Data Architecture",
  },
];

const projectItems = [
  {
    icon: FolderOpen,
    title: "Selected Work",
    value: "Production projects",
  },
  {
    icon: Layers3,
    title: "Case Studies",
    value: "Process / Architecture / Results",
  },
  {
    icon: Sparkles,
    title: "Experiments",
    value: "Interaction / Motion / UI",
  },
];

export default function HeroHud({ mode }: HeroHudProps) {
  const getPanelData = () => {
    switch (mode) {
      case "identity":
        return {
          label: "Identity",
          subtitle: "Profile signal detected",
          items: [
            {
              icon: UserRound,
              title: "Anmol Kumar",
              value: "Full Stack Developer",
            },
            {
              icon: Code2,
              title: "Focus",
              value: "Engineering × Interaction",
            },
            {
              icon: MapPin,
              title: "Based In",
              value: "India",
            },
          ],
        };

      case "stack":
        return {
          label: "Technology Stack",
          subtitle: "Development architecture",
          items: stackItems,
        };

      case "projects":
        return {
          label: "Project Archive",
          subtitle: "Work exploration ready",
          items: projectItems,
        };

      default:
        return {
          label: "Developer System",
          subtitle: "Live portfolio interface",
          items: defaultItems,
        };
    }
  };

  const data = getPanelData();

  return (
    <motion.aside
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: 0.7,
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative hidden [perspective:1200px] lg:block"
    >
      <motion.div
        whileHover={{
          y: -4,
          rotateX: 1,
          rotateY: -1,
        }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 18,
        }}
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl"
      >
        {/* Glow */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-cyan-400/10 blur-[80px]" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={data.label}
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              transition={{
                duration: 0.22,
              }}
            >
              <p className="text-[10px] uppercase tracking-[0.32em] text-white/30">
                {data.label}
              </p>

              <p className="mt-2 text-sm text-white/70">
                {data.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.05] px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-300/80">
              Online
            </span>
          </div>
        </div>

        {/* Metadata */}
        <div className="relative z-10 mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-white/45">
            <MapPin size={14} />
            India
          </div>

          <span className="font-mono text-[10px] tracking-[0.22em] text-white/20">
            IST / UTC+5:30
          </span>
        </div>

        {/* Dynamic content */}
        <div className="relative z-10 mt-7 min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{
                opacity: 0,
                y: 12,
                filter: "blur(6px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: -10,
                filter: "blur(6px)",
              }}
              transition={{
                duration: 0.25,
              }}
            >
              <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-white/25">
                Signal Data
              </p>

              <div className="space-y-2">
                {data.items.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.title}
                      initial={{
                        opacity: 0,
                        x: 10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.05,
                      }}
                      whileHover={{
                        x: 5,
                      }}
                      className="group flex cursor-default items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition-colors hover:border-white/15 hover:bg-white/[0.05]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035]">
                        <Icon
                          size={17}
                          className="text-white/55 transition-colors group-hover:text-cyan-200"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate text-sm text-white/75">
                            {item.title}
                          </p>

                          <span className="font-mono text-[10px] text-white/15">
                            0{index + 1}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-xs text-white/30">
                          {item.value}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scanner */}
        <div className="relative z-10 mt-6 overflow-hidden rounded-xl border border-white/[0.06] bg-black/20 px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">
              Signal
            </span>

            <span className="font-mono text-[10px] text-cyan-200/45">
              ACTIVE
            </span>
          </div>

          <div className="h-[2px] overflow-hidden rounded-full bg-white/[0.04]">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "300%" }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "linear",
              }}
              className="h-full w-1/3 bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-6 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">
            ANMOL.OS / 2026
          </p>

          <MagneticButton
            href="#contact"
            className="group flex items-center gap-2 text-xs text-white/45 transition hover:text-white"
          >
            Contact

            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </MagneticButton>
        </div>
      </motion.div>
    </motion.aside>
  );
}