"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  ExternalLink,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { FaGithub } from "react-icons/fa";

type Project = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  year: string;
  shortDescription: string;
  description: string;
  technologies: string[];

  thumbnail: string;
  thumbnailPublicId: string;

  images: string[];
  imagePublicIds: string[];

  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  order: number;
  isActive: boolean;
};

type ProjectForm = {
  title: string;
  slug: string;
  category: string;
  year: string;
  shortDescription: string;
  description: string;
  technologies: string;

  thumbnail: string;
  thumbnailPublicId: string;

  images: string[];
  imagePublicIds: string[];

  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  order: number;
  isActive: boolean;
};

const initialForm: ProjectForm = {
  title: "",
  slug: "",
  category: "",
  year: "",
  shortDescription: "",
  description: "",
  technologies: "",

  thumbnail: "",
  thumbnailPublicId: "",

  images: [],
  imagePublicIds: [],

  liveUrl: "",
  githubUrl: "",
  featured: false,
  order: 0,
  isActive: true,
};

export default function AdminProjectsPage() {
  const [projects, setProjects] =
    useState<Project[]>([]);

  const [form, setForm] =
    useState<ProjectForm>(initialForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [
    uploadingThumbnail,
    setUploadingThumbnail,
  ] = useState(false);

  const [
    uploadingGallery,
    setUploadingGallery,
  ] = useState(false);

  const [uploadError, setUploadError] =
    useState("");

  async function fetchProjects() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/projects?admin=true",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load projects"
        );
      }

      setProjects(data.projects || []);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load projects"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  function updateField<
    K extends keyof ProjectForm
  >(
    field: K,
    value: ProjectForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function generateSlug(
    value: string
  ) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleTitleChange(
    value: string
  ) {
    setForm((current) => ({
      ...current,
      title: value,
      slug:
        editingId && current.slug
          ? current.slug
          : generateSlug(value),
    }));
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(initialForm);
    setError("");
    setSuccess("");
    setUploadError("");
    setShowForm(true);
  }

  function openEditForm(
    project: Project
  ) {
    setEditingId(project._id);

    setForm({
      title: project.title,
      slug: project.slug,
      category:
        project.category || "",
      year: project.year || "",
      shortDescription:
        project.shortDescription || "",
      description:
        project.description || "",
      technologies:
        project.technologies.join(", "),
   
      images:
        project.images || [],
      liveUrl:
        project.liveUrl || "",
      githubUrl:
        project.githubUrl || "",
      featured:
        project.featured,
      order:
        project.order,
      isActive:
        project.isActive,
        thumbnail:
  project.thumbnail || "",

thumbnailPublicId:
  project.thumbnailPublicId || "",



imagePublicIds:
  project.imagePublicIds || [],
    });

    setError("");
    setSuccess("");
    setUploadError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
    setError("");
    setUploadError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        title:
          form.title.trim(),

        slug:
          form.slug.trim(),

        category:
          form.category.trim(),

        year:
          form.year.trim(),

        shortDescription:
          form.shortDescription.trim(),

        description:
          form.description.trim(),

        technologies:
          form.technologies
            .split(",")
            .map((technology) =>
              technology.trim()
            )
            .filter(Boolean),

       

        

        liveUrl:
          form.liveUrl.trim(),

        githubUrl:
          form.githubUrl.trim(),

        featured:
          form.featured,

        order:
          Number(form.order),

        isActive:
          form.isActive,

          thumbnail:
  form.thumbnail.trim(),

thumbnailPublicId:
  form.thumbnailPublicId.trim(),

images:
  form.images,

imagePublicIds:
  form.imagePublicIds,
      };

      const url = editingId
        ? `/api/projects/${editingId}`
        : "/api/projects";

      const response = await fetch(
        url,
        {
          method: editingId
            ? "PUT"
            : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(payload),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to save project"
        );
      }

      setSuccess(
        editingId
          ? "Project updated successfully."
          : "Project created successfully."
      );

      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);

      await fetchProjects();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to save project"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    project: Project
  ) {
    const confirmed =
      window.confirm(
        `Delete "${project.title}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(project._id);
      setError("");
      setSuccess("");

      const response =
        await fetch(
          `/api/projects/${project._id}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete project"
        );
      }

      setSuccess(
        "Project deleted successfully."
      );

      await fetchProjects();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete project"
      );
    } finally {
      setDeletingId(null);
    }
  }

 async function uploadFile(
  file: File
) {
  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  formData.append(
    "purpose",
    "project-image"
  );

  const response =
    await fetch(
      "/api/upload",
      {
        method: "POST",
        body: formData,
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "File upload failed"
    );
  }

  return {
    url: data.file.url as string,
    publicId:
      data.file.publicId as string,
  };
}

  async function handleThumbnailUpload(
  event: ChangeEvent<HTMLInputElement>
) {
  const file =
    event.target.files?.[0];

  if (!file) {
    return;
  }

  try {
    setUploadingThumbnail(true);
    setUploadError("");

    const uploaded =
      await uploadFile(file);

    setForm((current) => ({
      ...current,

      thumbnail:
        uploaded.url,

      thumbnailPublicId:
        uploaded.publicId,
    }));
  } catch (error) {
    setUploadError(
      error instanceof Error
        ? error.message
        : "Thumbnail upload failed"
    );
  } finally {
    setUploadingThumbnail(false);

    event.target.value = "";
  }
}

  async function handleGalleryUpload(
  event: ChangeEvent<HTMLInputElement>
) {
  const files =
    Array.from(
      event.target.files || []
    );

  if (files.length === 0) {
    return;
  }

  try {
    setUploadingGallery(true);
    setUploadError("");

    const uploadedUrls:
      string[] = [];

    const uploadedPublicIds:
      string[] = [];

    for (const file of files) {
      const uploaded =
        await uploadFile(file);

      uploadedUrls.push(
        uploaded.url
      );

      uploadedPublicIds.push(
        uploaded.publicId
      );
    }

    setForm((current) => ({
      ...current,

      images: [
        ...current.images,
        ...uploadedUrls,
      ],

      imagePublicIds: [
        ...current.imagePublicIds,
        ...uploadedPublicIds,
      ],
    }));
  } catch (error) {
    setUploadError(
      error instanceof Error
        ? error.message
        : "Gallery upload failed"
    );
  } finally {
    setUploadingGallery(false);

    event.target.value = "";
  }
}

  function removeGalleryImage(
  index: number
) {
  setForm((current) => ({
    ...current,

    images:
      current.images.filter(
        (_, imageIndex) =>
          imageIndex !== index
      ),

    imagePublicIds:
      current.imagePublicIds.filter(
        (_, imageIndex) =>
          imageIndex !== index
      ),
  }));
}

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-cyan-400">
              Content / Projects
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Projects
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
              Manage projects displayed
              in your public portfolio.
            </p>
          </div>

          <button
            type="button"
            onClick={
              openCreateForm
            }
            className="flex items-center justify-center gap-2 bg-cyan-400 px-5 py-3 text-sm font-medium text-black transition hover:bg-cyan-300"
          >
            <Plus size={17} />
            Add Project
          </button>
        </header>

        {error && (
          <div className="mb-6 border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-300">
            {success}
          </div>
        )}

        {showForm && (
          <section className="mb-10 border border-white/10 bg-white/[0.02]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                  {editingId
                    ? "Edit Record"
                    : "New Record"}
                </p>

                <h2 className="mt-1 text-lg font-medium">
                  {editingId
                    ? "Update Project"
                    : "Create Project"}
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  closeForm
                }
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/50 transition hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="p-5 sm:p-6"
            >
              <div className="grid gap-5 lg:grid-cols-2">
                <AdminInput
                  label="Project Title"
                  value={
                    form.title
                  }
                  onChange={
                    handleTitleChange
                  }
                  required
                  placeholder="Nishchal Portfolio"
                />

                <AdminInput
                  label="Slug"
                  value={
                    form.slug
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "slug",
                      generateSlug(
                        value
                      )
                    )
                  }
                  required
                  placeholder="nishchal-portfolio"
                />

                <AdminInput
                  label="Category"
                  value={
                    form.category
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "category",
                      value
                    )
                  }
                  placeholder="Full Stack"
                />

                <AdminInput
                  label="Year"
                  value={
                    form.year
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "year",
                      value
                    )
                  }
                  placeholder="2026"
                />

                <div className="lg:col-span-2">
                  <AdminInput
                    label="Short Description"
                    value={
                      form.shortDescription
                    }
                    onChange={(
                      value
                    ) =>
                      updateField(
                        "shortDescription",
                        value
                      )
                    }
                    placeholder="Short summary displayed in the project archive."
                  />
                </div>

                <div className="lg:col-span-2">
                  <AdminTextarea
                    label="Description"
                    value={
                      form.description
                    }
                    onChange={(
                      value
                    ) =>
                      updateField(
                        "description",
                        value
                      )
                    }
                    placeholder="Describe the project, its purpose and what you built..."
                  />
                </div>

                <div className="lg:col-span-2">
                  <AdminInput
                    label="Technologies"
                    value={
                      form.technologies
                    }
                    onChange={(
                      value
                    ) =>
                      updateField(
                        "technologies",
                        value
                      )
                    }
                    placeholder="Next.js, MongoDB, TypeScript"
                    helper="Separate technologies with commas."
                  />
                </div>

                <AdminInput
                  label="Live URL"
                  value={
                    form.liveUrl
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "liveUrl",
                      value
                    )
                  }
                  placeholder="https://example.com"
                />

                <AdminInput
                  label="GitHub URL"
                  value={
                    form.githubUrl
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "githubUrl",
                      value
                    )
                  }
                  placeholder="https://github.com/..."
                />

                <div className="lg:col-span-2">
                  <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/40">
                    Project Thumbnail
                  </label>

                  <div className="border border-white/10 bg-black/20 p-4">
                    {form.thumbnail && (
                      <div className="mb-4 overflow-hidden border border-white/10">
                        <img
                          src={
                            form.thumbnail
                          }
                          alt="Project thumbnail preview"
                          className="h-56 w-full object-cover"
                        />
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={
                        handleThumbnailUpload
                      }
                      disabled={
                        uploadingThumbnail
                      }
                      className="block w-full text-sm text-white/50 file:mr-4 file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
                    />

                    {uploadingThumbnail && (
                      <p className="mt-3 text-xs text-cyan-400">
                        Uploading
                        thumbnail...
                      </p>
                    )}

                    {form.thumbnail && (
                      <p className="mt-3 break-all text-xs text-white/20">
                        {
                          form.thumbnail
                        }
                      </p>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/40">
                    Project Gallery
                  </label>

                  <div className="border border-white/10 bg-black/20 p-4">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={
                        handleGalleryUpload
                      }
                      disabled={
                        uploadingGallery
                      }
                      className="block w-full text-sm text-white/50 file:mr-4 file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
                    />

                    {uploadingGallery && (
                      <p className="mt-3 text-xs text-cyan-400">
                        Uploading
                        gallery
                        images...
                      </p>
                    )}

                    {uploadError && (
                      <p className="mt-3 text-xs text-red-300">
                        {
                          uploadError
                        }
                      </p>
                    )}

                    {form.images
                      .length >
                      0 && (
                      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {form.images.map(
                          (
                            image,
                            index
                          ) => (
                            <div
                              key={`${image}-${index}`}
                              className="relative overflow-hidden border border-white/10"
                            >
                              <img
                                src={
                                  image
                                }
                                alt={`Project image ${
                                  index +
                                  1
                                }`}
                                className="h-40 w-full object-cover"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  removeGalleryImage(
                                    index
                                  )
                                }
                                className="absolute right-2 top-2 bg-black/85 px-3 py-1.5 text-xs text-red-300 transition hover:text-red-200"
                              >
                                Remove
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <AdminInput
                  label="Display Order"
                  type="number"
                  value={String(
                    form.order
                  )}
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "order",
                      Number(
                        value
                      )
                    )
                  }
                />

                <div className="flex flex-col justify-end gap-3">
                  <Toggle
                    label="Featured Project"
                    checked={
                      form.featured
                    }
                    onChange={(
                      checked
                    ) =>
                      updateField(
                        "featured",
                        checked
                      )
                    }
                  />

                  <Toggle
                    label="Visible on Portfolio"
                    checked={
                      form.isActive
                    }
                    onChange={(
                      checked
                    ) =>
                      updateField(
                        "isActive",
                        checked
                      )
                    }
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    closeForm
                  }
                  className="border border-white/10 px-5 py-3 text-sm text-white/60 transition hover:bg-white/[0.04] hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    uploadingThumbnail ||
                    uploadingGallery
                  }
                  className="bg-cyan-400 px-6 py-3 text-sm font-medium text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Project"
                      : "Create Project"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section>
          {loading ? (
            <div className="border border-white/10 px-6 py-16 text-center text-sm text-white/40">
              Loading projects...
            </div>
          ) : projects.length ===
            0 ? (
            <div className="border border-dashed border-white/10 px-6 py-16 text-center">
              <p className="text-lg text-white/70">
                No projects yet
              </p>

              <p className="mt-2 text-sm text-white/30">
                Add your first
                project using the
                button above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map(
                (project) => (
                  <article
                    key={
                      project._id
                    }
                    className="border border-white/10 bg-white/[0.02] p-5 sm:p-6"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                            {project.category ||
                              "Uncategorized"}
                          </span>

                          {project.featured && (
                            <span className="border border-cyan-400/20 bg-cyan-400/5 px-2 py-1 text-[10px] uppercase tracking-wider text-cyan-300">
                              Featured
                            </span>
                          )}

                          <span
                            className={`border px-2 py-1 text-[10px] uppercase tracking-wider ${
                              project.isActive
                                ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
                                : "border-white/10 text-white/30"
                            }`}
                          >
                            {project.isActive
                              ? "Active"
                              : "Hidden"}
                          </span>
                        </div>

                        <div className="flex flex-col gap-5 sm:flex-row">
                          {project.thumbnail && (
                            <img
                              src={
                                project.thumbnail
                              }
                              alt={
                                project.title
                              }
                              className="h-32 w-full border border-white/10 object-cover sm:w-48"
                            />
                          )}

                          <div className="min-w-0">
                            <h2 className="text-xl font-medium">
                              {
                                project.title
                              }
                            </h2>

                            <p className="mt-1 font-mono text-xs text-white/25">
                              /projects/
                              {
                                project.slug
                              }
                            </p>

                            {project.shortDescription && (
                              <p className="mt-4 max-w-3xl text-sm leading-6 text-white/40">
                                {
                                  project.shortDescription
                                }
                              </p>
                            )}

                            <div className="mt-4 flex flex-wrap gap-2">
                              {project.technologies.map(
                                (
                                  technology
                                ) => (
                                  <span
                                    key={
                                      technology
                                    }
                                    className="border border-white/10 px-2 py-1 text-xs text-white/40"
                                  >
                                    {
                                      technology
                                    }
                                  </span>
                                )
                              )}
                            </div>

                            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-white/30">
                              <span>
                                Year:{" "}
                                {project.year ||
                                  "—"}
                              </span>

                              <span>
                                Order:{" "}
                                {
                                  project.order
                                }
                              </span>

                              <span>
                                Gallery:{" "}
                                {project
                                  .images
                                  ?.length ||
                                  0}{" "}
                                image
                                {project
                                  .images
                                  ?.length ===
                                1
                                  ? ""
                                  : "s"}
                              </span>

                              {project.liveUrl && (
                                <a
                                  href={
                                    project.liveUrl
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1 transition hover:text-cyan-400"
                                >
                                  <ExternalLink
                                    size={
                                      13
                                    }
                                  />
                                  Live
                                </a>
                              )}

                              {project.githubUrl && (
                                <a
                                  href={
                                    project.githubUrl
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1 transition hover:text-cyan-400"
                                >
                                  <FaGithub
                                    size={
                                      13
                                    }
                                  />
                                  GitHub
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(
                              project
                            )
                          }
                          className="flex items-center gap-2 border border-white/10 px-3 py-2 text-xs text-white/50 transition hover:border-cyan-400/30 hover:text-cyan-400"
                        >
                          <Pencil
                            size={
                              14
                            }
                          />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              project
                            )
                          }
                          disabled={
                            deletingId ===
                            project._id
                          }
                          className="flex items-center gap-2 border border-red-500/10 px-3 py-2 text-xs text-red-300/60 transition hover:border-red-500/30 hover:text-red-300 disabled:opacity-40"
                        >
                          <Trash2
                            size={
                              14
                            }
                          />

                          {deletingId ===
                          project._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

type AdminInputProps = {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  type?: string;
  placeholder?: string;
  helper?: string;
  required?: boolean;
};

function AdminInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  helper,
  required = false,
}: AdminInputProps) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/40">
        {label}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        placeholder={
          placeholder
        }
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400/40"
      />

      {helper && (
        <p className="mt-2 text-xs text-white/25">
          {helper}
        </p>
      )}
    </div>
  );
}

type AdminTextareaProps = {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
};

function AdminTextarea({
  label,
  value,
  onChange,
  placeholder,
}: AdminTextareaProps) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/40">
        {label}
      </label>

      <textarea
        value={value}
        placeholder={
          placeholder
        }
        rows={7}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full resize-y border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400/40"
      />
    </div>
  );
}

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (
    checked: boolean
  ) => void;
};

function Toggle({
  label,
  checked,
  onChange,
}: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between border border-white/10 bg-black/20 px-4 py-3">
      <span className="text-sm text-white/60">
        {label}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(
            event.target.checked
          )
        }
        className="h-4 w-4 accent-cyan-400"
      />
    </label>
  );
}