"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

type Experience = {
  _id: string;
  role: string;
  company: string;
  period: string;
  type: string;
  description: string;
  highlights: string[];
  order: number;
  isActive: boolean;
};

type ExperienceForm = {
  role: string;
  company: string;
  period: string;
  type: string;
  description: string;
  highlights: string;
  order: number;
  isActive: boolean;
};

const initialForm: ExperienceForm = {
  role: "",
  company: "",
  period: "",
  type: "",
  description: "",
  highlights: "",
  order: 0,
  isActive: true,
};

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [form, setForm] = useState<ExperienceForm>(initialForm);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchExperiences() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/experience?admin=true", {
  cache: "no-store",
});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load experience"
        );
      }

      setExperiences(data.experiences || []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load experience"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExperiences();
  }, []);

  function updateField<K extends keyof ExperienceForm>(
    field: K,
    value: ExperienceForm[K]
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
    setShowForm(true);
  }

  function openEditForm(experience: Experience) {
    setEditingId(experience._id);

    setForm({
      role: experience.role,
      company: experience.company,
      period: experience.period,
      type: experience.type || "",
      description: experience.description || "",
      highlights: experience.highlights.join("\n"),
      order: experience.order,
      isActive: experience.isActive,
    });

    setError("");
    setSuccess("");
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
        role: form.role.trim(),
        company: form.company.trim(),
        period: form.period.trim(),
        type: form.type.trim(),
        description: form.description.trim(),

        highlights: form.highlights
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        order: Number(form.order),
        isActive: form.isActive,
      };

      const response = await fetch(
        editingId
          ? `/api/experience/${editingId}`
          : "/api/experience",
        {
          method: editingId ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save experience"
        );
      }

      setSuccess(
        editingId
          ? "Experience updated successfully."
          : "Experience created successfully."
      );

      setShowForm(false);
      setEditingId(null);
      setForm(initialForm);

      await fetchExperiences();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save experience"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(experience: Experience) {
    const confirmed = window.confirm(
      `Delete "${experience.role}" at "${experience.company}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(experience._id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/experience/${experience._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete experience"
        );
      }

      setSuccess("Experience deleted successfully.");

      await fetchExperiences();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete experience"
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
              Content / Experience
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Experience
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
              Manage your professional experience and career history.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="flex items-center justify-center gap-2 bg-cyan-400 px-5 py-3 text-sm font-medium text-black transition hover:bg-cyan-300"
          >
            <Plus size={17} />
            Add Experience
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
                  {editingId ? "Edit Record" : "New Record"}
                </p>

                <h2 className="mt-1 text-lg font-medium">
                  {editingId
                    ? "Update Experience"
                    : "Create Experience"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/50 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <AdminInput
                  label="Role"
                  value={form.role}
                  onChange={(value) =>
                    updateField("role", value)
                  }
                  placeholder="Full Stack Developer"
                  required
                />

                <AdminInput
                  label="Company"
                  value={form.company}
                  onChange={(value) =>
                    updateField("company", value)
                  }
                  placeholder="Company Name"
                  required
                />

                <AdminInput
                  label="Period"
                  value={form.period}
                  onChange={(value) =>
                    updateField("period", value)
                  }
                  placeholder="2025 — Present"
                  required
                />

                <AdminInput
                  label="Type"
                  value={form.type}
                  onChange={(value) =>
                    updateField("type", value)
                  }
                  placeholder="Full-time / Internship / Freelance"
                />

                <div className="md:col-span-2">
                  <AdminTextarea
                    label="Description"
                    value={form.description}
                    onChange={(value) =>
                      updateField("description", value)
                    }
                    placeholder="Describe your role and responsibilities..."
                    rows={6}
                  />
                </div>

                <div className="md:col-span-2">
                  <AdminTextarea
                    label="Highlights"
                    value={form.highlights}
                    onChange={(value) =>
                      updateField("highlights", value)
                    }
                    placeholder={`Built production web applications
Improved application performance
Worked with MongoDB and Next.js`}
                    rows={6}
                    helper="Write one highlight per line."
                  />
                </div>

                <AdminInput
                  label="Display Order"
                  type="number"
                  value={String(form.order)}
                  onChange={(value) =>
                    updateField(
                      "order",
                      Number(value)
                    )
                  }
                />

                <div className="flex items-end">
                  <Toggle
                    label="Visible on Portfolio"
                    checked={form.isActive}
                    onChange={(checked) =>
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
                  onClick={closeForm}
                  className="border border-white/10 px-5 py-3 text-sm text-white/60 hover:bg-white/[0.04]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-cyan-400 px-6 py-3 text-sm font-medium text-black hover:bg-cyan-300 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Experience"
                      : "Create Experience"}
                </button>
              </div>
            </form>
          </section>
        )}

        {loading ? (
          <div className="border border-white/10 py-16 text-center text-sm text-white/40">
            Loading experience...
          </div>
        ) : experiences.length === 0 ? (
          <div className="border border-dashed border-white/10 py-16 text-center">
            <BriefcaseBusiness
              size={28}
              className="mx-auto mb-4 text-white/20"
            />

            <p className="text-white/60">
              No experience added yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {experiences.map((experience) => (
              <article
                key={experience._id}
                className="border border-white/10 bg-white/[0.02] p-5 sm:p-6"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                        {experience.type || "Experience"}
                      </span>

                      <span
                        className={`border px-2 py-1 text-[10px] uppercase tracking-wider ${
                          experience.isActive
                            ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
                            : "border-white/10 text-white/30"
                        }`}
                      >
                        {experience.isActive
                          ? "Active"
                          : "Hidden"}
                      </span>
                    </div>

                    <h2 className="text-xl font-medium">
                      {experience.role}
                    </h2>

                    <p className="mt-1 text-sm text-white/50">
                      {experience.company}
                    </p>

                    <p className="mt-2 font-mono text-xs text-white/25">
                      {experience.period}
                    </p>

                    {experience.description && (
                      <p className="mt-4 max-w-3xl text-sm leading-6 text-white/40">
                        {experience.description}
                      </p>
                    )}

                    {experience.highlights.length > 0 && (
                      <ul className="mt-5 space-y-2">
                        {experience.highlights.map(
                          (highlight, index) => (
                            <li
                              key={`${experience._id}-${index}`}
                              className="flex gap-3 text-sm text-white/40"
                            >
                              <span className="text-cyan-400">
                                —
                              </span>

                              <span>{highlight}</span>
                            </li>
                          )
                        )}
                      </ul>
                    )}

                    <p className="mt-5 text-xs text-white/25">
                      Order: {experience.order}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(experience)
                      }
                      className="flex items-center gap-2 border border-white/10 px-3 py-2 text-xs text-white/50 transition hover:border-cyan-400/30 hover:text-cyan-400"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(experience)
                      }
                      disabled={
                        deletingId === experience._id
                      }
                      className="flex items-center gap-2 border border-red-500/10 px-3 py-2 text-xs text-red-300/60 transition hover:border-red-500/30 hover:text-red-300 disabled:opacity-40"
                    >
                      <Trash2 size={14} />

                      {deletingId === experience._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type AdminInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
};

function AdminInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
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
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400/40"
      />
    </div>
  );
}

type AdminTextareaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helper?: string;
  rows?: number;
};

function AdminTextarea({
  label,
  value,
  onChange,
  placeholder,
  helper,
  rows = 6,
}: AdminTextareaProps) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/40">
        {label}
      </label>

      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full resize-y border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400/40"
      />

      {helper && (
        <p className="mt-2 text-xs text-white/25">
          {helper}
        </p>
      )}
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
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex w-full cursor-pointer items-center justify-between border border-white/10 bg-black/20 px-4 py-3">
      <span className="text-sm text-white/60">
        {label}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="h-4 w-4 accent-cyan-400"
      />
    </label>
  );
}