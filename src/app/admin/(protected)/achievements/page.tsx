"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Award,
  ExternalLink,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

type Achievement = {
  _id: string;
  title: string;
  issuer: string;
  year: string;
  type: string;
  status: string;
  description: string;
  tags: string[];

  image: string;
  imagePublicId: string;

  credentialUrl: string;
  order: number;
  isActive: boolean;
};

type AchievementForm = {
  title: string;
  issuer: string;
  year: string;
  type: string;
  status: string;
  description: string;
  tags: string;

  image: string;
  imagePublicId: string;

  credentialUrl: string;
  order: number;
  isActive: boolean;
};

const initialForm: AchievementForm = {
  title: "",
  issuer: "",
  year: "",
  type: "",
  status: "",
  description: "",
  tags: "",

  image: "",
  imagePublicId: "",

  credentialUrl: "",
  order: 0,
  isActive: true,
};

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] =
    useState<Achievement[]>([]);

  const [form, setForm] =
    useState<AchievementForm>(initialForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [
    uploadingImage,
    setUploadingImage,
  ] = useState(false);

  const [
    uploadError,
    setUploadError,
  ] = useState("");

  async function fetchAchievements() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/achievements?admin=true",
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

      setAchievements(
        data.achievements || []
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load achievements"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAchievements();
  }, []);

  function updateField<
    K extends keyof AchievementForm
  >(
    field: K,
    value: AchievementForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
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
    achievement: Achievement
  ) {
    setEditingId(
      achievement._id
    );

    setForm({
      title:
        achievement.title,

      issuer:
        achievement.issuer,

      year:
        achievement.year || "",

      type:
        achievement.type || "",

      status:
        achievement.status || "",

      description:
        achievement.description || "",

      tags:
        achievement.tags.join(", "),

      image:
        achievement.image || "",
        imagePublicId:
  achievement.imagePublicId || "",

      credentialUrl:
        achievement.credentialUrl || "",

      order:
        achievement.order,

      isActive:
        achievement.isActive,
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

 async function handleAchievementImageUpload(
  event: ChangeEvent<HTMLInputElement>
) {
  const file =
    event.target.files?.[0];

  if (!file) {
    return;
  }

  try {
    setUploadingImage(true);
    setUploadError("");

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "purpose",
      "achievement-image"
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
          "Image upload failed"
      );
    }

    setForm((current) => ({
      ...current,

      image:
        data.file.url,

      imagePublicId:
        data.file.publicId,
    }));
  } catch (error) {
    setUploadError(
      error instanceof Error
        ? error.message
        : "Image upload failed"
    );
  } finally {
    setUploadingImage(false);

    event.target.value = "";
  }
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

        issuer:
          form.issuer.trim(),

        year:
          form.year.trim(),

        type:
          form.type.trim(),

        status:
          form.status.trim(),

        description:
          form.description.trim(),

        tags:
          form.tags
            .split(",")
            .map((tag) =>
              tag.trim()
            )
            .filter(Boolean),

        image:
  form.image.trim(),

imagePublicId:
  form.imagePublicId.trim(),
        credentialUrl:
          form.credentialUrl.trim(),

        order:
          Number(form.order),

        isActive:
          form.isActive,
      };

      const response =
        await fetch(
          editingId
            ? `/api/achievements/${editingId}`
            : "/api/achievements",
          {
            method: editingId
              ? "PUT"
              : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload
              ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to save achievement"
        );
      }

      setSuccess(
        editingId
          ? "Achievement updated successfully."
          : "Achievement created successfully."
      );

      setShowForm(false);
      setEditingId(null);
      setForm(initialForm);

      await fetchAchievements();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save achievement"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    achievement: Achievement
  ) {
    const confirmed =
      window.confirm(
        `Delete "${achievement.title}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        achievement._id
      );

      setError("");
      setSuccess("");

      const response =
        await fetch(
          `/api/achievements/${achievement._id}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete achievement"
        );
      }

      setSuccess(
        "Achievement deleted successfully."
      );

      await fetchAchievements();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete achievement"
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-cyan-400">
              Content / Achievements
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Achievements
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
              Manage certificates,
              awards and verified
              achievements.
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
            Add Achievement
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
                    ? "Update Achievement"
                    : "Create Achievement"}
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  closeForm
                }
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/50 hover:text-white"
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
              <div className="grid gap-5 md:grid-cols-2">
                <AdminInput
                  label="Title"
                  value={
                    form.title
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "title",
                      value
                    )
                  }
                  placeholder="Full Stack Development Certificate"
                  required
                />

                <AdminInput
                  label="Issuer"
                  value={
                    form.issuer
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "issuer",
                      value
                    )
                  }
                  placeholder="Organization / Platform"
                  required
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

                <AdminInput
                  label="Type"
                  value={
                    form.type
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "type",
                      value
                    )
                  }
                  placeholder="Certificate / Award"
                />

                <AdminInput
                  label="Status"
                  value={
                    form.status
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "status",
                      value
                    )
                  }
                  placeholder="Verified / Completed"
                />

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

                <div className="md:col-span-2">
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
                    placeholder="Describe the achievement..."
                  />
                </div>

                <div className="md:col-span-2">
                  <AdminInput
                    label="Tags"
                    value={
                      form.tags
                    }
                    onChange={(
                      value
                    ) =>
                      updateField(
                        "tags",
                        value
                      )
                    }
                    placeholder="React, Next.js, Full Stack"
                    helper="Separate tags with commas."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/40">
                    Certificate /
                    Achievement Image
                  </label>

                  <div className="border border-white/10 bg-black/20 p-4">
                    {form.image && (
                      <div className="mb-4 overflow-hidden border border-white/10">
                        <img
                          src={
                            form.image
                          }
                          alt="Achievement preview"
                          className="h-64 w-full object-contain bg-black"
                        />
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={
                        handleAchievementImageUpload
                      }
                      disabled={
                        uploadingImage
                      }
                      className="block w-full text-sm text-white/50 file:mr-4 file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
                    />

                    {uploadingImage && (
                      <p className="mt-3 text-xs text-cyan-400">
                        Uploading
                        image...
                      </p>
                    )}

                    {uploadError && (
                      <p className="mt-3 text-xs text-red-300">
                        {
                          uploadError
                        }
                      </p>
                    )}

                    {form.image && (
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="min-w-0 break-all text-xs text-white/20">
                          {
                            form.image
                          }
                        </p>

                        <a
                          href={
                            form.image
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 text-xs text-cyan-400 hover:text-cyan-300"
                        >
                          Open image
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <AdminInput
                    label="Credential URL"
                    value={
                      form.credentialUrl
                    }
                    onChange={(
                      value
                    ) =>
                      updateField(
                        "credentialUrl",
                        value
                      )
                    }
                    placeholder="https://..."
                  />
                </div>

                <div className="md:col-span-2">
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
                  className="border border-white/10 px-5 py-3 text-sm text-white/60 hover:bg-white/[0.04]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    uploadingImage
                  }
                  className="bg-cyan-400 px-6 py-3 text-sm font-medium text-black hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Achievement"
                      : "Create Achievement"}
                </button>
              </div>
            </form>
          </section>
        )}

        {loading ? (
          <div className="border border-white/10 py-16 text-center text-sm text-white/40">
            Loading
            achievements...
          </div>
        ) : achievements.length ===
          0 ? (
          <div className="border border-dashed border-white/10 py-16 text-center">
            <Award
              size={28}
              className="mx-auto mb-4 text-white/20"
            />

            <p className="text-white/60">
              No achievements yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {achievements.map(
              (achievement) => (
                <article
                  key={
                    achievement._id
                  }
                  className="border border-white/10 bg-white/[0.02] p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        {achievement.type && (
                          <span className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                            {
                              achievement.type
                            }
                          </span>
                        )}

                        {achievement.status && (
                          <span className="border border-white/10 px-2 py-1 text-[10px] uppercase tracking-wider text-white/40">
                            {
                              achievement.status
                            }
                          </span>
                        )}

                        <span
                          className={`border px-2 py-1 text-[10px] uppercase tracking-wider ${
                            achievement.isActive
                              ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
                              : "border-white/10 text-white/30"
                          }`}
                        >
                          {achievement.isActive
                            ? "Active"
                            : "Hidden"}
                        </span>
                      </div>

                      <div className="flex flex-col gap-5 sm:flex-row">
                        {achievement.image && (
                          <img
                            src={
                              achievement.image
                            }
                            alt={
                              achievement.title
                            }
                            className="h-32 w-full border border-white/10 object-cover sm:w-48"
                          />
                        )}

                        <div className="min-w-0">
                          <h2 className="text-xl font-medium">
                            {
                              achievement.title
                            }
                          </h2>

                          <p className="mt-1 text-sm text-white/50">
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

                          {achievement.description && (
                            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/40">
                              {
                                achievement.description
                              }
                            </p>
                          )}

                          {achievement
                            .tags
                            .length >
                            0 && (
                            <div className="mt-5 flex flex-wrap gap-2">
                              {achievement.tags.map(
                                (
                                  tag
                                ) => (
                                  <span
                                    key={
                                      tag
                                    }
                                    className="border border-white/10 px-2 py-1 text-xs text-white/40"
                                  >
                                    {
                                      tag
                                    }
                                  </span>
                                )
                              )}
                            </div>
                          )}

                          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-white/30">
                            <span>
                              Order:{" "}
                              {
                                achievement.order
                              }
                            </span>

                            {achievement.credentialUrl && (
                              <a
                                href={
                                  achievement.credentialUrl
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
                                Credential
                              </a>
                            )}

                            {achievement.image && (
                              <a
                                href={
                                  achievement.image
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
                                Certificate
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
                            achievement
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
                            achievement
                          )
                        }
                        disabled={
                          deletingId ===
                          achievement._id
                        }
                        className="flex items-center gap-2 border border-red-500/10 px-3 py-2 text-xs text-red-300/60 transition hover:border-red-500/30 hover:text-red-300 disabled:opacity-40"
                      >
                        <Trash2
                          size={
                            14
                          }
                        />

                        {deletingId ===
                        achievement._id
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

function AdminTextarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/40">
        {label}
      </label>

      <textarea
        value={value}
        rows={6}
        placeholder={
          placeholder
        }
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

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (
    checked: boolean
  ) => void;
}) {
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