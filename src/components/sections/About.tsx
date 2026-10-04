"use client";

import { useProfile } from "@/hooks/useProfile";

export default function About() {
  const { profile } = useProfile();

  return (
    <section
      id="about"
      className="relative border-t border-white/10 bg-[#050505] px-4 py-24 text-white sm:px-6 lg:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-14 lg:mb-20">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-400">
            01 / About
          </p>

          <h2 className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            More than a stack of technologies.
          </h2>
        </header>

        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {profile.profileImage && (
            <div className="overflow-hidden border border-white/10 bg-white/[0.02]">
              <img
                src={profile.profileImage}
                alt={profile.name || "Profile"}
                className="h-[360px] w-full object-cover object-top sm:h-[440px] lg:h-[520px]"
              />
            </div>
          )}

          <div className="flex min-h-full flex-col justify-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/25">
              About Me
            </p>

            {profile.about ? (
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/55 sm:text-lg sm:leading-9">
                {profile.about}
              </p>
            ) : (
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/40">
                Building thoughtful digital experiences across frontend,
                backend, databases, and modern web technologies.
              </p>
            )}

            {profile.shortBio && (
              <div className="mt-10 border-t border-white/10 pt-8">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/20">
                  Current Direction
                </p>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45">
                  {profile.shortBio}
                </p>
              </div>
            )}

            {profile.availability && (
              <div className="mt-8 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <span className="text-xs uppercase tracking-[0.18em] text-white/35">
                  Available for opportunities
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}