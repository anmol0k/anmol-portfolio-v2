"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "motion/react";

import {
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Projects", href: "#projects" },
  { label: "Achievements", href: "#achievements" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    navbarVisible,
    setNavbarVisible,
  ] = useState(true);

  const lastScrollY =
    useRef(0);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY =
        window.scrollY;

      // Always show navbar near the top
      if (currentScrollY < 80) {
        setNavbarVisible(true);
        lastScrollY.current =
          currentScrollY;
        return;
      }

      // Keep navbar visible while mobile menu is open
      if (mobileOpen) {
        setNavbarVisible(true);
        lastScrollY.current =
          currentScrollY;
        return;
      }

      const difference =
        currentScrollY -
        lastScrollY.current;

      /*
       * Ignore very tiny scroll changes.
       * Prevents navbar from flickering
       * from trackpad/momentum movement.
       */
      if (
        Math.abs(difference) <
        6
      ) {
        return;
      }

      if (difference > 0) {
        // scrolling down
        setNavbarVisible(false);
      } else {
        // scrolling up
        setNavbarVisible(true);
      }

      lastScrollY.current =
        currentScrollY;
    }

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [mobileOpen]);

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <>
      <motion.header
        initial={{
          y: -40,
          opacity: 0,
        }}
        animate={{
          y: navbarVisible
            ? 0
            : -110,

          opacity:
            navbarVisible
              ? 1
              : 0,
        }}
        transition={{
          duration: 0.32,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5 lg:px-10 lg:py-6">
          {/* Logo */}
          <a
            href="#home"
            onClick={
              closeMobileMenu
            }
            className="relative z-50 text-sm font-semibold uppercase tracking-[0.28em] text-white"
          >
            ANMOL
            <span className="text-white/40">
              /DEV
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
            {navItems.map(
              (item) => (
                <a
                  key={
                    item.label
                  }
                  href={
                    item.href
                  }
                  className="text-sm text-white/55 transition-colors duration-300 hover:text-white"
                >
                  {
                    item.label
                  }
                </a>
              )
            )}
          </nav>

          {/* Desktop CTA */}
          <a
            href="#contact"
            className="group hidden items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-white backdrop-blur-xl transition hover:border-white/30 hover:bg-white/[0.08] sm:flex"
          >
            Let&apos;s talk

            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(
                (current) =>
                  !current
              );

              setNavbarVisible(
                true
              );
            }}
            aria-label={
              mobileOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={
              mobileOpen
            }
            className="relative z-50 flex h-10 w-10 items-center justify-center border border-white/15 bg-black/30 text-white backdrop-blur-xl transition hover:border-cyan-400/30 lg:hidden"
          >
            {mobileOpen ? (
              <X size={18} />
            ) : (
              <Menu
                size={18}
              />
            )}
          </button>
        </div>
      </motion.header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close mobile menu"
              onClick={
                closeMobileMenu
              }
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
              }}
              className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              initial={{
                opacity: 0,
                y: -24,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.3,
                ease:
                  "easeOut",
              }}
              className="fixed left-4 right-4 top-[72px] z-50 border border-white/10 bg-[#080808]/95 p-4 shadow-2xl backdrop-blur-2xl sm:left-auto sm:right-6 sm:w-[340px] lg:hidden"
            >
              <div className="mb-4 border-b border-white/10 pb-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400">
                  Navigation
                </p>

                <p className="mt-2 text-sm text-white/35">
                  Explore the
                  portfolio
                </p>
              </div>

              <nav className="space-y-1">
                {navItems.map(
                  (
                    item,
                    index
                  ) => (
                    <a
                      key={
                        item.label
                      }
                      href={
                        item.href
                      }
                      onClick={
                        closeMobileMenu
                      }
                      className="group flex items-center justify-between border border-transparent px-3 py-3 transition hover:border-white/10 hover:bg-white/[0.03]"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-[10px] text-white/20">
                          {String(
                            index +
                              1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <span className="text-sm text-white/65 transition group-hover:text-white">
                          {
                            item.label
                          }
                        </span>
                      </div>

                      <span className="text-xs text-white/20 transition group-hover:translate-x-1 group-hover:text-cyan-400">
                        →
                      </span>
                    </a>
                  )
                )}
              </nav>

              <div className="mt-4 border-t border-white/10 pt-4 sm:hidden">
                <a
                  href="#contact"
                  onClick={
                    closeMobileMenu
                  }
                  className="flex w-full items-center justify-center gap-2 bg-cyan-400 px-4 py-3 text-sm font-medium text-black transition hover:bg-cyan-300"
                >
                  Let&apos;s talk

                  <ArrowUpRight
                    size={15}
                  />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}