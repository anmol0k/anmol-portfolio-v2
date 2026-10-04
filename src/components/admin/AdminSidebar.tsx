"use client";

import { useState } from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import Link from "next/link";

import {
  Award,
  BriefcaseBusiness,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  Monitor,
  UserRound,
  Wrench,
  X,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    href: "/admin/profile",
    icon: UserRound,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    label: "Skills",
    href: "/admin/skills",
    icon: Wrench,
  },
  {
    label: "Experience",
    href: "/admin/experience",
    icon: BriefcaseBusiness,
  },
  {
    label: "Education",
    href: "/admin/education",
    icon: GraduationCap,
  },
  {
    label: "Achievements",
    href: "/admin/achievements",
    icon: Award,
  },
  {
    label: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: Mail,
  },
];

export default function AdminSidebar() {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await fetch(
        "/api/admin/logout",
        {
          method: "POST",
        }
      );

      router.push(
        "/admin/login"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      setLoggingOut(false);
    }
  }

  function isActive(
    href: string
  ) {
    if (
      href ===
      "/admin/dashboard"
    ) {
      return (
        pathname === href
      );
    }

    return pathname.startsWith(
      href
    );
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-6">
        <Link
          href="/admin/dashboard"
          onClick={() =>
            setMobileOpen(false)
          }
          className="block"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
            Anmol.OS
          </p>

          <h2 className="mt-2 text-lg font-medium text-white">
            Admin Control
          </h2>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-1">
          {navigation.map(
            (item) => {
              const Icon =
                item.icon;

              const active =
                isActive(
                  item.href
                );

              return (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  onClick={() =>
                    setMobileOpen(
                      false
                    )
                  }
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition ${
                    active
                      ? "bg-cyan-400 text-black"
                      : "text-white/45 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <Icon
                    size={17}
                  />

                  <span>
                    {
                      item.label
                    }
                  </span>
                </Link>
              );
            }
          )}
        </div>
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          onClick={() =>
            setMobileOpen(false)
          }
          className="mb-2 flex items-center gap-3 px-4 py-3 text-sm text-white/45 transition hover:bg-white/[0.04] hover:text-white"
        >
          <Monitor size={17} />

          View Portfolio
        </Link>

        <button
          type="button"
          onClick={
            handleLogout
          }
          disabled={
            loggingOut
          }
          className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-300/60 transition hover:bg-red-500/[0.05] hover:text-red-300 disabled:opacity-40"
        >
          <LogOut size={17} />

          {loggingOut
            ? "Logging out..."
            : "Logout"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-64 border-r border-white/10 bg-[#080808] lg:block">
        {sidebarContent}
      </aside>

      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#080808]/95 px-4 backdrop-blur lg:hidden">
        <Link
          href="/admin/dashboard"
          className="text-sm font-medium tracking-[0.2em] text-white"
        >
          ANMOL.OS
        </Link>

        <button
          type="button"
          onClick={() =>
            setMobileOpen(
              (current) =>
                !current
            )
          }
          className="flex h-10 w-10 items-center justify-center border border-white/10 text-white/70"
          aria-label="Toggle admin navigation"
        >
          {mobileOpen ? (
            <X size={19} />
          ) : (
            <Menu
              size={19}
            />
          )}
        </button>
      </div>

      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() =>
              setMobileOpen(
                false
              )
            }
            className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          />

          <aside className="fixed bottom-0 left-0 top-0 z-50 w-[280px] max-w-[85vw] border-r border-white/10 bg-[#080808] lg:hidden">
            {
              sidebarContent
            }
          </aside>
        </>
      )}
    </>
  );
}