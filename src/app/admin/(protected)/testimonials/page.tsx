"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";

type Testimonial = {
  _id: string;
  name: string;
  designation: string;
  company: string;
  image: string;
  imagePublicId: string;
  comment: string;
  order: number;
  isActive: boolean;
};

type TestimonialForm = {
  name: string;
  designation: string;
  company: string;
  image: string;
  imagePublicId: string;
  comment: string;
  order: number;
  isActive: boolean;
};

const initialForm: TestimonialForm =
  {
    name: "",
    designation: "",
    company: "",
    image: "",
    imagePublicId: "",
    comment: "",
    order: 0,
    isActive: true,
  };

export default function AdminTestimonialsPage() {
  const [
    testimonials,
    setTestimonials,
  ] = useState<
    Testimonial[]
  >([]);

  const [form, setForm] =
    useState<TestimonialForm>(
      initialForm
    );

  const [
    editingId,
    setEditingId,
  ] = useState<
    string | null
  >(null);

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    deletingId,
    setDeletingId,
  ] = useState<
    string | null
  >(null);

  const [
    uploadingImage,
    setUploadingImage,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    uploadError,
    setUploadError,
  ] = useState("");

  async function fetchTestimonials() {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          "/api/testimonials?admin=true",
          {
            cache:
              "no-store",
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
        data.testimonials ||
          []
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load testimonials"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTestimonials();
  }, []);

  function updateField<
    K extends keyof TestimonialForm,
  >(
    field: K,
    value:
      TestimonialForm[K]
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]:
          value,
      })
    );
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
    testimonial: Testimonial
  ) {
    setEditingId(
      testimonial._id
    );

    setForm({
      name:
        testimonial.name ||
        "",

      designation:
        testimonial.designation ||
        "",

      company:
        testimonial.company ||
        "",

      image:
        testimonial.image ||
        "",

      imagePublicId:
        testimonial.imagePublicId ||
        "",

      comment:
        testimonial.comment ||
        "",

      order:
        testimonial.order ||
        0,

      isActive:
        testimonial.isActive,
    });

    setError("");
    setSuccess("");
    setUploadError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior:
        "smooth",
    });
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
    setError("");
    setUploadError("");
  }

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploadingImage(
        true
      );

      setUploadError("");

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "purpose",
        "testimonial-image"
      );

      const response =
        await fetch(
          "/api/upload",
          {
            method:
              "POST",

            body:
              formData,
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

      setForm(
        (current) => ({
          ...current,

          image:
            data.file.url,

          imagePublicId:
            data.file
              .publicId,
        })
      );
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "Image upload failed"
      );
    } finally {
      setUploadingImage(
        false
      );

      event.target.value =
        "";
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
        name:
          form.name.trim(),

        designation:
          form.designation.trim(),

        company:
          form.company.trim(),

        image:
          form.image.trim(),

        imagePublicId:
          form.imagePublicId.trim(),

        comment:
          form.comment.trim(),

        order:
          Number(
            form.order
          ),

        isActive:
          form.isActive,
      };

      const response =
        await fetch(
          editingId
            ? `/api/testimonials/${editingId}`
            : "/api/testimonials",
          {
            method:
              editingId
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
            "Unable to save testimonial"
        );
      }

      setSuccess(
        editingId
          ? "Testimonial updated successfully."
          : "Testimonial created successfully."
      );

      setShowForm(false);
      setEditingId(null);
      setForm(initialForm);

      await fetchTestimonials();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save testimonial"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    testimonial: Testimonial
  ) {
    const confirmed =
      window.confirm(
        `Delete testimonial from "${testimonial.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        testimonial._id
      );

      setError("");
      setSuccess("");

      const response =
        await fetch(
          `/api/testimonials/${testimonial._id}`,
          {
            method:
              "DELETE",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete testimonial"
        );
      }

      setSuccess(
        "Testimonial deleted successfully."
      );

      await fetchTestimonials();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete testimonial"
      );
    } finally {
      setDeletingId(
        null
      );
    }
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-cyan-400">
              Content /
              Testimonials
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Testimonials
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
              Manage client
              and collaborator
              feedback displayed
              on your portfolio.
            </p>
          </div>

          <button
            type="button"
            onClick={
              openCreateForm
            }
            className="flex items-center justify-center gap-2 bg-cyan-400 px-5 py-3 text-sm font-medium text-black transition hover:bg-cyan-300"
          >
            <Plus
              size={17}
            />

            Add Testimonial
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
                    ? "Update Testimonial"
                    : "Create Testimonial"}
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  closeForm
                }
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/50 transition hover:text-white"
              >
                <X
                  size={18}
                />
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
                  label="Name"
                  value={
                    form.name
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "name",
                      value
                    )
                  }
                  required
                  placeholder="Prince Chauhan"
                />

                <AdminInput
                  label="Designation"
                  value={
                    form.designation
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "designation",
                      value
                    )
                  }
                  placeholder="CEO"
                />

                <AdminInput
                  label="Company"
                  value={
                    form.company
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "company",
                      value
                    )
                  }
                  placeholder="Khabai Tech"
                />

                <AdminInput
                  label="Order"
                  value={String(
                    form.order
                  )}
                  type="number"
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

                <div className="lg:col-span-2">
                  <AdminTextarea
                    label="Testimonial"
                    value={
                      form.comment
                    }
                    onChange={(
                      value
                    ) =>
                      updateField(
                        "comment",
                        value
                      )
                    }
                    required
                    placeholder="Write the client's feedback..."
                  />
                </div>

                <div className="lg:col-span-2">
                  <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/35">
                    Profile Image
                  </p>

                  <div className="border border-white/10 bg-black/20 p-4">
                    {form.image && (
                      <div className="mb-4 flex items-center gap-4">
                        <img
                          src={
                            form.image
                          }
                          alt={
                            form.name ||
                            "Testimonial"
                          }
                          className="h-20 w-20 rounded-full border border-white/10 object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setForm(
                              (
                                current
                              ) => ({
                                ...current,
                                image:
                                  "",
                                imagePublicId:
                                  "",
                              })
                            )
                          }
                          className="text-xs text-red-300/70 transition hover:text-red-300"
                        >
                          Remove
                          image
                        </button>
                      </div>
                    )}

                    <label className="inline-flex cursor-pointer items-center gap-2 border border-white/10 px-4 py-3 text-xs text-white/50 transition hover:border-cyan-400/30 hover:text-white">
                      <Upload
                        size={
                          15
                        }
                      />

                      {uploadingImage
                        ? "Uploading..."
                        : form.image
                          ? "Replace Image"
                          : "Upload Image"}

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={
                          uploadingImage
                        }
                        onChange={
                          handleImageUpload
                        }
                        className="hidden"
                      />
                    </label>

                    {uploadError && (
                      <p className="mt-3 text-xs text-red-300">
                        {
                          uploadError
                        }
                      </p>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <label className="flex cursor-pointer items-center gap-3 border border-white/10 bg-black/20 px-4 py-4">
                    <input
                      type="checkbox"
                      checked={
                        form.isActive
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "isActive",
                          event
                            .target
                            .checked
                        )
                      }
                      className="h-4 w-4 accent-cyan-400"
                    />

                    <div>
                      <p className="text-sm text-white/70">
                        Visible on
                        Portfolio
                      </p>

                      <p className="mt-1 text-xs text-white/25">
                        Show this
                        testimonial
                        publicly.
                      </p>
                    </div>
                  </label>
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
                    uploadingImage
                  }
                  className="bg-cyan-400 px-6 py-3 text-sm font-medium text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Testimonial"
                      : "Create Testimonial"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section>
          {loading ? (
            <div className="border border-white/10 px-6 py-16 text-center text-sm text-white/40">
              Loading
              testimonials...
            </div>
          ) : testimonials.length ===
            0 ? (
            <div className="border border-dashed border-white/10 px-6 py-16 text-center">
              <p className="text-lg text-white/70">
                No testimonials
                yet
              </p>

              <p className="mt-2 text-sm text-white/30">
                Add your first
                testimonial.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {testimonials.map(
                (
                  testimonial
                ) => (
                  <article
                    key={
                      testimonial._id
                    }
                    className="border border-white/10 bg-white/[0.02] p-5 sm:p-6"
                  >
                    <div className="flex items-start gap-4">
                      {testimonial.image ? (
                        <img
                          src={
                            testimonial.image
                          }
                          alt={
                            testimonial.name
                          }
                          className="h-14 w-14 shrink-0 rounded-full border border-white/10 object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-lg text-white/30">
                          {testimonial.name
                            .charAt(
                              0
                            )
                            .toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h2 className="text-base font-medium text-white">
                              {
                                testimonial.name
                              }
                            </h2>

                            <p className="mt-1 text-xs text-cyan-400">
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
                          </div>

                          <span
                            className={`border px-2 py-1 text-[10px] uppercase tracking-wider ${
                              testimonial.isActive
                                ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
                                : "border-white/10 text-white/30"
                            }`}
                          >
                            {testimonial.isActive
                              ? "Active"
                              : "Hidden"}
                          </span>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-white/45">
                          “
                          {
                            testimonial.comment
                          }
                          ”
                        </p>

                        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/20">
                          Order:{" "}
                          {
                            testimonial.order
                          }
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-3 border-t border-white/10 pt-4">
                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(
                            testimonial
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
                            testimonial
                          )
                        }
                        disabled={
                          deletingId ===
                          testimonial._id
                        }
                        className="flex items-center gap-2 border border-red-500/10 px-3 py-2 text-xs text-red-300/60 transition hover:border-red-500/30 hover:text-red-300 disabled:opacity-40"
                      >
                        <Trash2
                          size={
                            14
                          }
                        />

                        {deletingId ===
                        testimonial._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
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
      <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/35">
        {label}
      </label>

      <input
        type={type}
        value={value}
        required={
          required
        }
        placeholder={
          placeholder
        }
        onChange={(
          event
        ) =>
          onChange(
            event.target
              .value
          )
        }
        className="w-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400/40"
      />
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
  required?: boolean;
};

function AdminTextarea({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: AdminTextareaProps) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/35">
        {label}
      </label>

      <textarea
        value={value}
        required={
          required
        }
        rows={6}
        placeholder={
          placeholder
        }
        onChange={(
          event
        ) =>
          onChange(
            event.target
              .value
          )
        }
        className="w-full resize-y border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400/40"
      />
    </div>
  );
}