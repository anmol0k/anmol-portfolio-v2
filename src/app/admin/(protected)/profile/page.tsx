"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Mail, Phone, Save, UserRound } from "lucide-react";

import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";

type ProfileForm = {
  name: string;
  title: string;
  shortBio: string;
  about: string;
  email: string;
  phone: string;

  resumeUrl: string;
  resumePublicId: string;

  profileImage: string;
  profileImagePublicId: string;

  availability: boolean;

  socialLinks: {
    github: string;
    linkedin: string;
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
};

const initialForm: ProfileForm = {
  name: "",
  title: "",
  shortBio: "",
  about: "",
  email: "",
  phone: "",
  resumeUrl: "",
  resumePublicId: "",

  profileImage: "",
  profileImagePublicId: "",

  availability: true,

  socialLinks: {
    github: "",
    linkedin: "",
    instagram: "",
    facebook: "",
    whatsapp: "",
  },
};

export default function AdminProfilePage() {
  const [uploadingResume, setUploadingResume] = useState(false);

  const [resumeUploadError, setResumeUploadError] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);

  const [uploadError, setUploadError] = useState("");
  const [form, setForm] = useState<ProfileForm>(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchProfile() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/profile", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load profile");
      }

      if (data.profile) {
        setForm({
          name: data.profile.name || "",
          title: data.profile.title || "",
          shortBio: data.profile.shortBio || "",
          about: data.profile.about || "",
          email: data.profile.email || "",
          phone: data.profile.phone || "",
          resumeUrl: data.profile.resumeUrl || "",

          resumePublicId: data.profile.resumePublicId || "",

          profileImage: data.profile.profileImage || "",

          profileImagePublicId: data.profile.profileImagePublicId || "",
          availability: data.profile.availability ?? true,

          socialLinks: {
            github: data.profile.socialLinks?.github || "",
            linkedin: data.profile.socialLinks?.linkedin || "",
            instagram: data.profile.socialLinks?.instagram || "",
            facebook: data.profile.socialLinks?.facebook || "",
            whatsapp: data.profile.socialLinks?.whatsapp || "",
          },
        });
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to load profile",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  function updateField<K extends keyof ProfileForm>(
    field: K,
    value: ProfileForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateSocial(
    field: keyof ProfileForm["socialLinks"],
    value: string,
  ) {
    setForm((current) => ({
      ...current,

      socialLinks: {
        ...current.socialLinks,
        [field]: value,
      },
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: form.name.trim(),
        title: form.title.trim(),
        shortBio: form.shortBio.trim(),
        about: form.about.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        resumeUrl:
  form.resumeUrl.trim(),

resumePublicId:
  form.resumePublicId.trim(),

profileImage:
  form.profileImage.trim(),

profileImagePublicId:
  form.profileImagePublicId.trim(),

availability:
  form.availability,

        socialLinks: {
          github: form.socialLinks.github.trim(),
          linkedin: form.socialLinks.linkedin.trim(),
          instagram: form.socialLinks.instagram.trim(),
          facebook: form.socialLinks.facebook.trim(),
          whatsapp: form.socialLinks.whatsapp.trim(),
        },
      };

      const response = await fetch("/api/profile", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update profile");
      }

      setSuccess("Profile updated successfully.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to update profile",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-16 text-center text-sm text-white/40 sm:px-6">
        Loading profile...
      </div>
    );
  }

  async function handleProfileImageUpload(
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
      "profile-image"
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

      profileImage:
        data.file.url,

      profileImagePublicId:
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
  async function handleResumeUpload(
  event: ChangeEvent<HTMLInputElement>
) {
  const file =
    event.target.files?.[0];

  if (!file) {
    return;
  }

  try {
    setUploadingResume(true);
    setResumeUploadError("");

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "purpose",
      "resume"
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
          "Resume upload failed"
      );
    }

    setForm((current) => ({
      ...current,

      resumeUrl:
        data.file.url,

      resumePublicId:
        data.file.publicId,
    }));
  } catch (error) {
    setResumeUploadError(
      error instanceof Error
        ? error.message
        : "Resume upload failed"
    );
  } finally {
    setUploadingResume(false);

    event.target.value = "";
  }
}

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 border-b border-white/10 pb-8">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-cyan-400">
            Content / Profile
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Profile
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
            Manage your personal identity, contact information and social links.
          </p>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="border border-white/10 bg-white/[0.02]">
            <SectionHeading
              icon={<UserRound size={17} />}
              title="Identity"
              description="Core information displayed across your portfolio."
            />

            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
              <AdminInput
                label="Name"
                value={form.name}
                onChange={(value) => updateField("name", value)}
                placeholder="Anmol Kumar"
                required
              />

              <AdminInput
                label="Professional Title"
                value={form.title}
                onChange={(value) => updateField("title", value)}
                placeholder="Full Stack Developer"
                required
              />

              <div className="lg:col-span-2">
                <AdminTextarea
                  label="Short Bio"
                  value={form.shortBio}
                  onChange={(value) => updateField("shortBio", value)}
                  placeholder="A short introduction for the hero/contact area..."
                  rows={4}
                />
              </div>

              <div className="lg:col-span-2">
                <AdminTextarea
                  label="About"
                  value={form.about}
                  onChange={(value) => updateField("about", value)}
                  placeholder="Write your longer portfolio biography..."
                  rows={8}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/40">
                  Profile Image
                </label>

                <div className="border border-white/10 bg-black/20 p-4">
                  {form.profileImage && (
                    <div className="mb-4 overflow-hidden border border-white/10">
                      <img
                        src={form.profileImage}
                        alt="Profile preview"
                        className="h-48 w-full object-cover"
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleProfileImageUpload}
                    disabled={uploadingImage}
                    className="block w-full text-sm text-white/50 file:mr-4 file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
                  />

                  {uploadingImage && (
                    <p className="mt-3 text-xs text-cyan-400">
                      Uploading image...
                    </p>
                  )}

                  {uploadError && (
                    <p className="mt-3 text-xs text-red-300">{uploadError}</p>
                  )}

                  {form.profileImage && (
                    <p className="mt-3 break-all text-xs text-white/25">
                      {form.profileImage}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/40">
                  Resume
                </label>

                <div className="border border-white/10 bg-black/20 p-4">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleResumeUpload}
                    disabled={uploadingResume}
                    className="block w-full text-sm text-white/50 file:mr-4 file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
                  />

                  {uploadingResume && (
                    <p className="mt-3 text-xs text-cyan-400">
                      Uploading resume...
                    </p>
                  )}

                  {resumeUploadError && (
                    <p className="mt-3 text-xs text-red-300">
                      {resumeUploadError}
                    </p>
                  )}

                  {form.resumeUrl && (
                    <div className="mt-4">
                      <a
                        href={form.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-cyan-400 underline underline-offset-4"
                      >
                        View uploaded resume
                      </a>

                      <p className="mt-2 break-all text-xs text-white/25">
                        {form.resumeUrl}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="lg:col-span-2">
                <Toggle
                  label="Available for Opportunities"
                  checked={form.availability}
                  onChange={(checked) => updateField("availability", checked)}
                />
              </div>
            </div>
          </section>

          <section className="border border-white/10 bg-white/[0.02]">
            <SectionHeading
              icon={<Mail size={17} />}
              title="Contact"
              description="Contact information displayed in your portfolio."
            />

            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
              <AdminInput
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) => updateField("email", value)}
                placeholder="you@example.com"
                icon={<Mail size={15} />}
              />

              <AdminInput
                label="Phone"
                value={form.phone}
                onChange={(value) => updateField("phone", value)}
                placeholder="+91..."
                icon={<Phone size={15} />}
              />
            </div>
          </section>

          <section className="border border-white/10 bg-white/[0.02]">
            <SectionHeading
              icon={<FaGithub size={17} />}
              title="Social Links"
              description="Accounts displayed in the portfolio and contact section."
            />

            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
              <AdminInput
                label="GitHub"
                value={form.socialLinks.github}
                onChange={(value) => updateSocial("github", value)}
                placeholder="https://github.com/..."
                icon={<FaGithub size={15} />}
              />

              <AdminInput
                label="LinkedIn"
                value={form.socialLinks.linkedin}
                onChange={(value) => updateSocial("linkedin", value)}
                placeholder="https://linkedin.com/in/..."
                icon=<FaLinkedin size={15} />
              />

              <AdminInput
                label="Instagram"
                value={form.socialLinks.instagram}
                onChange={(value) => updateSocial("instagram", value)}
                placeholder="https://instagram.com/..."
                icon={<FaInstagram size={15} />}
              />

              <AdminInput
                label="Facebook"
                value={form.socialLinks.facebook}
                onChange={(value) => updateSocial("facebook", value)}
                placeholder="https://facebook.com/..."
                icon={<FaFacebook size={15} />}
              />

              <div className="lg:col-span-2">
                <AdminInput
                  label="WhatsApp"
                  value={form.socialLinks.whatsapp}
                  onChange={(value) => updateSocial("whatsapp", value)}
                  placeholder="https://wa.me/91..."
                  icon={<FaWhatsapp size={15} />}
                />
              </div>
            </div>
          </section>

          <div className="sticky bottom-4 z-20 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-cyan-400 px-6 py-3 text-sm font-medium text-black shadow-2xl transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />

              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SectionHeading({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
      <div className="mt-0.5 text-cyan-400">{icon}</div>

      <div>
        <h2 className="font-medium text-white">{title}</h2>

        <p className="mt-1 text-xs leading-5 text-white/30">{description}</p>
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
  icon?: React.ReactNode;
};

function AdminInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  icon,
}: AdminInputProps) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/40">
        {label}
      </label>

      <div className="flex items-center border border-white/10 bg-black/30 transition focus-within:border-cyan-400/40">
        {icon && <span className="ml-4 text-white/30">{icon}</span>}

        <input
          type={type}
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/20"
        />
      </div>
    </div>
  );
}

function AdminTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 6,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/40">
        {label}
      </label>

      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
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
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between border border-white/10 bg-black/20 px-4 py-3">
      <span className="text-sm text-white/60">{label}</span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-cyan-400"
      />
    </label>
  );
}
