import Link from "next/link";
import {
  Award,
  BriefcaseBusiness,
  FolderKanban,
  GraduationCap,
  UserRound,
  Wrench,
} from "lucide-react";

const sections = [
  {
    title: "Profile",
    description:
      "Manage your identity, biography, contact information and social links.",
    href: "/admin/profile",
    icon: UserRound,
  },
  {
    title: "Projects",
    description:
      "Create, update and organize projects displayed on your portfolio.",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    title: "Skills",
    description:
      "Manage technologies, skill categories and their display order.",
    href: "/admin/skills",
    icon: Wrench,
  },
  {
    title: "Experience",
    description:
      "Manage professional roles, companies and career highlights.",
    href: "/admin/experience",
    icon: BriefcaseBusiness,
  },
  {
    title: "Education",
    description:
      "Manage qualifications, institutions and academic records.",
    href: "/admin/education",
    icon: GraduationCap,
  },
  {
    title: "Achievements",
    description:
      "Manage certifications, awards and professional achievements.",
    href: "/admin/achievements",
    icon: Award,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-cyan-400">
            Control Center
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
            Manage the information powering your public portfolio.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map((section, index) => {
            const Icon = section.icon;

            return (
              <Link
                key={section.title}
                href={section.href}
                className="group relative overflow-hidden border border-white/10 bg-white/[0.02] p-6 transition duration-300 hover:border-cyan-400/30 hover:bg-white/[0.04]"
              >
                <div className="mb-10 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center border border-white/10 bg-black/40">
                    <Icon
                      size={19}
                      className="text-white/50 transition group-hover:text-cyan-400"
                    />
                  </div>

                  <span className="font-mono text-[10px] text-white/20">
                    0{index + 1}
                  </span>
                </div>

                <h2 className="text-lg font-medium text-white">
                  {section.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  {section.description}
                </p>

                <div className="mt-6 text-xs uppercase tracking-[0.2em] text-white/20 transition group-hover:text-cyan-400">
                  Manage →
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </div>
  );
}