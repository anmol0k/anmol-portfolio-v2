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
  ArrowLeft,
  ArrowRight,
  Quote,
} from "lucide-react";

type Testimonial = {
  _id: string;
  name: string;
  designation: string;
  company: string;
  image: string;
  comment: string;
  order: number;
  isActive: boolean;
};

export default function Testimonials() {
  const [
    testimonials,
    setTestimonials,
  ] = useState<Testimonial[]>([]);

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [
    visibleCount,
    setVisibleCount,
  ] = useState(3);

  const [
    isPaused,
    setIsPaused,
  ] = useState(false);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const response =
          await fetch(
            "/api/testimonials",
            {
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load testimonials"
          );
        }

        setTestimonials(
          data.testimonials || []
        );
      } catch (error) {
        console.error(
          "Testimonials fetch error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadTestimonials();
  }, []);

  useEffect(() => {
    function updateVisibleCount() {
      const width =
        window.innerWidth;

      if (width < 768) {
        setVisibleCount(1);
        return;
      }

      if (width < 1024) {
        setVisibleCount(2);
        return;
      }

      setVisibleCount(3);
    }

    updateVisibleCount();

    window.addEventListener(
      "resize",
      updateVisibleCount
    );

    return () =>
      window.removeEventListener(
        "resize",
        updateVisibleCount
      );
  }, []);

  const shouldSlide =
    testimonials.length >
    visibleCount;

  useEffect(() => {
    if (
      !shouldSlide ||
      isPaused
    ) {
      return;
    }

    const interval =
      window.setInterval(
        () => {
          setCurrentIndex(
            (current) =>
              (current + 1) %
              testimonials.length
          );
        },
        4500
      );

    return () =>
      window.clearInterval(
        interval
      );
  }, [
    shouldSlide,
    isPaused,
    testimonials.length,
  ]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [visibleCount]);

  const visibleTestimonials =
    useMemo(() => {
      if (
        testimonials.length ===
        0
      ) {
        return [];
      }

      if (!shouldSlide) {
        return testimonials.slice(
          0,
          visibleCount
        );
      }

      return Array.from(
        {
          length:
            visibleCount,
        },
        (_, offset) => {
          const index =
            (currentIndex +
              offset) %
            testimonials.length;

          return testimonials[
            index
          ];
        }
      );
    }, [
      testimonials,
      visibleCount,
      currentIndex,
      shouldSlide,
    ]);

  function goNext() {
    if (!shouldSlide) {
      return;
    }

    setCurrentIndex(
      (current) =>
        (current + 1) %
        testimonials.length
    );
  }

  function goPrevious() {
    if (!shouldSlide) {
      return;
    }

    setCurrentIndex(
      (current) =>
        (current -
          1 +
          testimonials.length) %
        testimonials.length
    );
  }

  if (loading) {
    return (
      <section
        id="testimonials"
        className="border-t border-white/10 bg-[#050505] px-4 py-20 text-white sm:px-6 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-white/30">
            Loading testimonials...
          </p>
        </div>
      </section>
    );
  }

  if (
    testimonials.length ===
    0
  ) {
    return null;
  }

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden border-t border-white/10 bg-[#050505] px-4 py-20 text-white sm:px-6 lg:px-10 lg:py-24"
      onMouseEnter={() =>
        setIsPaused(true)
      }
      onMouseLeave={() =>
        setIsPaused(false)
      }
    >
      {/* subtle background */}
      <div className="pointer-events-none absolute right-0 top-0 h-[380px] w-[380px] rounded-full bg-cyan-400/[0.025] blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <header>
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-400">
              07 / Testimonials
            </p>

            <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Trusted by people
              I&apos;ve worked with.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-white/35">
              Feedback from clients,
              collaborators and teams
              I&apos;ve worked with.
            </p>
          </header>

          {shouldSlide && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={
                  goPrevious
                }
                aria-label="Previous testimonials"
                className="group flex h-10 w-10 items-center justify-center border border-white/10 bg-white/[0.02] text-white/35 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.04] hover:text-cyan-400"
              >
                <ArrowLeft
                  size={16}
                  className="transition group-hover:-translate-x-0.5"
                />
              </button>

              <button
                type="button"
                onClick={
                  goNext
                }
                aria-label="Next testimonials"
                className="group flex h-10 w-10 items-center justify-center border border-white/10 bg-white/[0.02] text-white/35 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.04] hover:text-cyan-400"
              >
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-0.5"
                />
              </button>
            </div>
          )}
        </div>

        {/* Slider */}
        <div className="overflow-hidden">
          <AnimatePresence
            mode="wait"
          >
            <motion.div
              key={
                currentIndex
              }
              initial={{
                opacity: 0,
                x: 55,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -35,
              }}
              transition={{
                duration: 0.45,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className={`grid gap-4 ${
                visibleCount === 1
                  ? "grid-cols-1"
                  : visibleCount ===
                      2
                    ? "grid-cols-2"
                    : "grid-cols-3"
              }`}
            >
              {visibleTestimonials.map(
                (
                  testimonial
                ) => (
                  <TestimonialCard
                    key={
                      testimonial._id
                    }
                    testimonial={
                      testimonial
                    }
                  />
                )
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer controls */}
        {shouldSlide && (
          <div className="mt-7 flex items-center justify-between border-t border-white/[0.06] pt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">
              Auto sliding
            </p>

            <div className="flex items-center gap-1.5">
              {testimonials.map(
                (
                  testimonial,
                  index
                ) => (
                  <button
                    key={
                      testimonial._id
                    }
                    type="button"
                    onClick={() =>
                      setCurrentIndex(
                        index
                      )
                    }
                    aria-label={`Show testimonial ${
                      index + 1
                    }`}
                    className={`h-[3px] transition-all duration-300 ${
                      currentIndex ===
                      index
                        ? "w-7 bg-cyan-400"
                        : "w-3 bg-white/15 hover:bg-white/30"
                    }`}
                  />
                )
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  return (
    <article className="group relative flex min-h-[260px] flex-col overflow-hidden border border-white/10 bg-white/[0.018] p-5 transition duration-300 hover:border-cyan-400/20 hover:bg-cyan-400/[0.018] sm:p-6">
      {/* hover accent */}
      <span className="absolute left-0 top-0 h-0 w-[2px] bg-cyan-400 transition-all duration-500 group-hover:h-full" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {testimonial.image ? (
            <div className="relative shrink-0">
              <div className="absolute -inset-[3px] rounded-full border border-cyan-400/10" />

              <img
                src={
                  testimonial.image
                }
                alt={
                  testimonial.name
                }
                className="relative h-12 w-12 rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-sm font-medium text-white/40">
              {testimonial.name
                .charAt(0)
                .toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium text-white/90">
              {
                testimonial.name
              }
            </h3>

            {(testimonial.designation ||
              testimonial.company) && (
              <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-white/30">
                {
                  testimonial.designation
                }

                {testimonial.designation &&
                testimonial.company
                  ? " · "
                  : ""}

                {
                  testimonial.company
                }
              </p>
            )}
          </div>
        </div>

        <Quote
          size={18}
          strokeWidth={1.5}
          className="shrink-0 text-cyan-400/25 transition group-hover:text-cyan-400/50"
        />
      </div>

      {/* Comment */}
      <div className="my-5 h-px bg-gradient-to-r from-white/10 via-white/[0.04] to-transparent" />

      <p className="line-clamp-6 text-sm leading-7 text-white/45 transition group-hover:text-white/55">
        &ldquo;
        {
          testimonial.comment
        }
        &rdquo;
      </p>

      {/* Footer */}
      <div className="mt-auto pt-6">
        <div className="flex items-center gap-2">
          <span className="h-[1px] w-6 bg-cyan-400/35" />

          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/20">
            Testimonial
          </span>
        </div>
      </div>
    </article>
  );
}