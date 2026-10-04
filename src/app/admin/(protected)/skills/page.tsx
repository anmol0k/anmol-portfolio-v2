"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Pencil,
  Plus,
  Trash2,
  Wrench,
  X,
} from "lucide-react";

type Skill = {
  _id: string;
  name: string;
  category: string;
  icon: string;
  order: number;
  isActive: boolean;
};

type SkillForm = {
  name: string;
  category: string;
  icon: string;
  order: number;
  isActive: boolean;
};

const initialForm: SkillForm = {
  name: "",
  category: "",
  icon: "",
  order: 0,
  isActive: true,
};

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState<SkillForm>(initialForm);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchSkills() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/skills?admin=true", {
  cache: "no-store",
});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load skills"
        );
      }

      setSkills(data.skills || []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load skills"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSkills();
  }, []);

  function updateField<K extends keyof SkillForm>(
    field: K,
    value: SkillForm[K]
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

  function openEditForm(skill: Skill) {
    setEditingId(skill._id);

    setForm({
      name: skill.name,
      category: skill.category,
      icon: skill.icon || "",
      order: skill.order,
      isActive: skill.isActive,
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
        name: form.name.trim(),
        category: form.category.trim(),
        icon: form.icon.trim(),
        order: Number(form.order),
        isActive: form.isActive,
      };

      const response = await fetch(
        editingId
          ? `/api/skills/${editingId}`
          : "/api/skills",
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
          data.message || "Unable to save skill"
        );
      }

      setSuccess(
        editingId
          ? "Skill updated successfully."
          : "Skill created successfully."
      );

      setShowForm(false);
      setEditingId(null);
      setForm(initialForm);

      await fetchSkills();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save skill"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(skill: Skill) {
    const confirmed = window.confirm(
      `Delete "${skill.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(skill._id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/skills/${skill._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete skill"
        );
      }

      setSuccess("Skill deleted successfully.");

      await fetchSkills();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete skill"
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
              Content / Skills
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Skills
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
              Manage technologies and skill categories shown in your
              portfolio.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="flex items-center justify-center gap-2 bg-cyan-400 px-5 py-3 text-sm font-medium text-black transition hover:bg-cyan-300"
          >
            <Plus size={17} />
            Add Skill
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
                  {editingId ? "Update Skill" : "Create Skill"}
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
                  label="Skill Name"
                  value={form.name}
                  onChange={(value) =>
                    updateField("name", value)
                  }
                  placeholder="React.js"
                  required
                />

                <AdminInput
                  label="Category"
                  value={form.category}
                  onChange={(value) =>
                    updateField("category", value)
                  }
                  placeholder="Frontend"
                  required
                />

                <AdminInput
                  label="Icon"
                  value={form.icon}
                  onChange={(value) =>
                    updateField("icon", value)
                  }
                  placeholder="react"
                  helper="For now this stores an icon identifier. We can improve icon selection later."
                />

                <AdminInput
                  label="Display Order"
                  type="number"
                  value={String(form.order)}
                  onChange={(value) =>
                    updateField("order", Number(value))
                  }
                />

                <div className="md:col-span-2">
                  <Toggle
                    label="Visible on Portfolio"
                    checked={form.isActive}
                    onChange={(checked) =>
                      updateField("isActive", checked)
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
                      ? "Update Skill"
                      : "Create Skill"}
                </button>
              </div>
            </form>
          </section>
        )}

        {loading ? (
          <div className="border border-white/10 py-16 text-center text-sm text-white/40">
            Loading skills...
          </div>
        ) : skills.length === 0 ? (
          <div className="border border-dashed border-white/10 py-16 text-center">
            <Wrench
              size={26}
              className="mx-auto mb-4 text-white/20"
            />

            <p className="text-white/60">
              No skills added yet.
            </p>

            <p className="mt-2 text-sm text-white/30">
              Add your first technology from the admin panel.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {skills.map((skill) => (
              <article
                key={skill._id}
                className="border border-white/10 bg-white/[0.02] p-5"
              >
                <div className="mb-8 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center border border-white/10 bg-black/30">
                    <Wrench
                      size={16}
                      className="text-cyan-400"
                    />
                  </div>

                  <span
                    className={`border px-2 py-1 text-[10px] uppercase tracking-wider ${
                      skill.isActive
                        ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
                        : "border-white/10 text-white/30"
                    }`}
                  >
                    {skill.isActive ? "Active" : "Hidden"}
                  </span>
                </div>

                <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                  {skill.category}
                </p>

                <h2 className="mt-2 text-lg font-medium">
                  {skill.name}
                </h2>

                <div className="mt-4 space-y-1 text-xs text-white/30">
                  <p>
                    Icon: {skill.icon || "—"}
                  </p>

                  <p>
                    Order: {skill.order}
                  </p>
                </div>

                <div className="mt-6 flex gap-2 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      openEditForm(skill)
                    }
                    className="flex flex-1 items-center justify-center gap-2 border border-white/10 px-3 py-2 text-xs text-white/50 transition hover:border-cyan-400/30 hover:text-cyan-400"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(skill)
                    }
                    disabled={
                      deletingId === skill._id
                    }
                    className="flex flex-1 items-center justify-center gap-2 border border-red-500/10 px-3 py-2 text-xs text-red-300/60 transition hover:border-red-500/30 hover:text-red-300 disabled:opacity-40"
                  >
                    <Trash2 size={13} />

                    {deletingId === skill._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
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
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400/40"
      />

      {helper && (
        <p className="mt-2 text-xs leading-5 text-white/25">
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
    <label className="flex cursor-pointer items-center justify-between border border-white/10 bg-black/20 px-4 py-3">
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