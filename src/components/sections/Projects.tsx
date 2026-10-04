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
  ChevronDown,
  ExternalLink,
  FolderKanban,
} from "lucide-react";

import { FaGithub } from "react-icons/fa";

type ProjectItem = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  year: string;
  shortDescription: string;
  description: string;
  technologies: string[];
  thumbnail: string;
  images: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  order: number;
  isActive: boolean;
};

export default function Projects() {
  const [projects, setProjects] =
    useState<ProjectItem[]>([]);

  const [activeId, setActiveId] =
    useState<string>("");

  const [activeImage, setActiveImage] =
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
    async function loadProjects() {
      try {
        const response = await fetch(
          "/api/projects",
          {
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load projects"
          );
        }

        const items: ProjectItem[] =
          data.projects || [];

        setProjects(items);
      } catch (error) {
        console.error(
          "Projects fetch error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const activeProject =
    useMemo(() => {
      return projects.find(
        (project) =>
          project._id ===
          activeId
      );
    }, [
      projects,
      activeId,
    ]);

  function getPrimaryImage(
    project: ProjectItem
  ) {
    return (
      project.thumbnail ||
      project.images?.[0] ||
      ""
    );
  }

  function handleDesktopEnter(
    project: ProjectItem
  ) {
    setActiveId(
      project._id
    );

    setActiveImage(
      getPrimaryImage(project)
    );

    setPanelVisible(true);
  }

  function handleDesktopSectionLeave() {
    setPanelVisible(false);
  }

  function toggleMobileProject(
    project: ProjectItem
  ) {
    setMobileOpenId(
      (current) =>
        current === project._id
          ? ""
          : project._id
    );
  }

  if (loading) {
    return (
      <section
        id="projects"
        className="border-t border-white/10 bg-[#050505] px-4 py-24 text-white sm:px-6 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-white/30">
            Loading projects...
          </p>
        </div>
      </section>
    );
  }

  if (
    projects.length === 0
  ) {
    return null;
  }

  return (
    <section
      id="projects"
      onMouseLeave={
        handleDesktopSectionLeave
      }
      className="border-t border-white/10 bg-[#050505] px-4 py-24 text-white sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-14">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-400">
            05 / Project Archive
          </p>

          <h2 className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Selected systems,
            interfaces and full-stack
            builds.
          </h2>
        </header>

        {/* MOBILE + TABLET */}
        <div className="space-y-3 lg:hidden">
          {projects.map(
            (
              project,
              index
            ) => {
              const open =
                mobileOpenId ===
                project._id;

              return (
                <div
                  key={
                    project._id
                  }
                  className="border border-white/10 bg-white/[0.01]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      toggleMobileProject(
                        project
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

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <h3
                          className={`text-lg font-medium transition ${
                            open
                              ? "text-cyan-400"
                              : "text-white/70"
                          }`}
                        >
                          {
                            project.title
                          }
                        </h3>

                        {project.featured && (
                          <span className="border border-cyan-400/20 bg-cyan-400/5 px-2 py-1 text-[9px] uppercase tracking-wider text-cyan-300">
                            Featured
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-white/35">
                        {project.category ||
                          "Project"}
                      </p>

                      {project.year && (
                        <p className="mt-2 font-mono text-xs text-white/25">
                          {
                            project.year
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
                          duration: 0.3,
                          ease: "easeOut",
                        }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/10">
                          <ProjectDetails
                            project={
                              project
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
            {projects.map(
              (
                project,
                index
              ) => {
                const active =
                  project._id ===
                    activeId &&
                  panelVisible;

                return (
                  <button
                    key={
                      project._id
                    }
                    type="button"
                    onMouseEnter={() =>
                      handleDesktopEnter(
                        project
                      )
                    }
                    onFocus={() =>
                      handleDesktopEnter(
                        project
                      )
                    }
                    onClick={() =>
                      handleDesktopEnter(
                        project
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

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <h3
                            className={`text-lg font-medium transition ${
                              active
                                ? "text-cyan-400"
                                : "text-white/70 group-hover:text-white"
                            }`}
                          >
                            {
                              project.title
                            }
                          </h3>

                          {project.featured && (
                            <span className="border border-cyan-400/20 bg-cyan-400/5 px-2 py-1 text-[9px] uppercase tracking-wider text-cyan-300">
                              Featured
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-white/35">
                          {project.category ||
                            "Project"}
                        </p>
                      </div>

                      <span className="shrink-0 font-mono text-xs text-white/25">
                        {project.year ||
                          "—"}
                      </span>
                    </div>
                  </button>
                );
              }
            )}
          </div>

          <div className="relative min-h-[620px]">
            <AnimatePresence
              mode="wait"
            >
              {panelVisible &&
                activeProject && (
                  <motion.div
                    key={
                      activeProject._id
                    }
                    initial={{
                      opacity: 0,
                      x: 56,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: 32,
                    }}
                    transition={{
                      duration: 0.32,
                      ease: "easeOut",
                    }}
                    className="sticky top-28"
                  >
                    <ProjectDetails
                      project={
                        activeProject
                      }
                      activeImage={
                        activeImage
                      }
                      onImageChange={
                        setActiveImage
                      }
                    />
                  </motion.div>
                )}
            </AnimatePresence>

            {!panelVisible && (
              <div className="flex min-h-[620px] items-center justify-center border border-dashed border-white/10 bg-white/[0.005]">
                <div className="max-w-xs text-center">
                  <FolderKanban
                    size={32}
                    className="mx-auto text-white/10"
                  />

                  <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-white/20">
                    Explore Projects
                  </p>

                  <p className="mt-3 text-sm leading-6 text-white/25">
                    Move your cursor
                    over a project to
                    inspect the build,
                    stack and gallery.
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

function ProjectDetails({
  project,
  activeImage: controlledImage,
  onImageChange,
  mobile = false,
}: {
  project: ProjectItem;
  activeImage?: string;
  onImageChange?: (
    image: string
  ) => void;
  mobile?: boolean;
}) {
  const [
    mobileImage,
    setMobileImage,
  ] = useState(
    project.thumbnail ||
      project.images?.[0] ||
      ""
  );

  useEffect(() => {
    if (mobile) {
      setMobileImage(
        project.thumbnail ||
          project.images?.[0] ||
          ""
      );
    }
  }, [
    project,
    mobile,
  ]);

  const activeImage =
    mobile
      ? mobileImage
      : controlledImage ||
        project.thumbnail ||
        project.images?.[0] ||
        "";

  const galleryImages = [
    project.thumbnail,
    ...(project.images || []),
  ].filter(
    (
      image,
      index,
      array
    ): image is string =>
      Boolean(image) &&
      array.indexOf(image) ===
        index
  );

  function chooseImage(
    image: string
  ) {
    if (mobile) {
      setMobileImage(image);
    } else {
      onImageChange?.(image);
    }
  }

  return (
    <div
      className={`overflow-hidden ${
        mobile
          ? ""
          : "border border-white/10 bg-white/[0.02]"
      }`}
    >
      <div className="relative h-[220px] border-b border-white/10 bg-black/40 sm:h-[260px] lg:h-[300px]">
        {activeImage ? (
          <img
            src={
              activeImage
            }
            alt={
              project.title
            }
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <FolderKanban
                size={32}
                className="mx-auto text-white/15"
              />

              <p className="mt-3 text-xs uppercase tracking-[0.25em] text-white/20">
                Project Preview
              </p>
            </div>
          </div>
        )}
      </div>

      {galleryImages.length >
        1 && (
        <div className="border-b border-white/10 p-3 sm:p-4">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {galleryImages.map(
              (
                image,
                index
              ) => {
                const selected =
                  activeImage ===
                  image;

                return (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() =>
                      chooseImage(
                        image
                      )
                    }
                    className={`shrink-0 overflow-hidden border transition ${
                      selected
                        ? "border-cyan-400"
                        : "border-white/10 hover:border-white/30"
                    }`}
                    aria-label={`Show project image ${
                      index +
                      1
                    }`}
                  >
                    <img
                      src={
                        image
                      }
                      alt={`${project.title} preview ${
                        index + 1
                      }`}
                      className="h-20 w-28 object-cover sm:h-24 sm:w-36"
                    />
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}

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
              {project.category ||
                "Project"}
            </p>

            {project.featured && (
              <span className="border border-cyan-400/20 bg-cyan-400/5 px-2 py-1 text-[9px] uppercase tracking-wider text-cyan-300">
                Featured
              </span>
            )}

            {project.year && (
              <span className="font-mono text-[10px] text-white/25">
                {
                  project.year
                }
              </span>
            )}
          </div>

          <h3 className="mt-3 text-2xl font-medium sm:text-3xl">
            {project.title}
          </h3>

          {project.shortDescription && (
            <p className="mt-3 text-sm leading-6 text-white/45">
              {
                project.shortDescription
              }
            </p>
          )}
        </div>

        {project.description && (
          <p className="mt-6 text-sm leading-7 text-white/45">
            {
              project.description
            }
          </p>
        )}

        {project
          .technologies
          .length > 0 && (
          <div className="mt-7">
            <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-white/25">
              Technology
            </p>

            <div className="flex flex-wrap gap-2">
              {project.technologies.map(
                (
                  technology
                ) => (
                  <span
                    key={
                      technology
                    }
                    className="border border-white/10 px-3 py-2 text-xs text-white/40"
                  >
                    {
                      technology
                    }
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {(project.liveUrl ||
          project.githubUrl) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {project.liveUrl && (
              <a
                href={
                  project.liveUrl
                }
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-cyan-400 px-4 py-3 text-xs font-medium text-black transition hover:bg-cyan-300"
              >
                <ExternalLink
                  size={14}
                />
                View Live
              </a>
            )}

            {project.githubUrl && (
              <a
                href={
                  project.githubUrl
                }
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 border border-white/10 px-4 py-3 text-xs text-white/60 transition hover:border-white/20 hover:text-white"
              >
                <FaGithub
                  size={14}
                />
                Source Code
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}