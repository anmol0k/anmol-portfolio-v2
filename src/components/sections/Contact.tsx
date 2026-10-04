"use client";

import {
  FormEvent,
  useRef,
  useState,
} from "react";

import emailjs from "@emailjs/browser";

import {
  Mail,
  Phone,
  Send,
} from "lucide-react";

import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";

import { useProfile } from "@/hooks/useProfile";

export default function Contact() {
  const { profile } = useProfile();

  const formRef =
    useRef<HTMLFormElement>(null);

  const [sending, setSending] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

 async function handleSubmit(
  event: FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  if (!formRef.current) {
    return;
  }

  try {
    setSending(true);
    setSuccessMessage("");
    setErrorMessage("");

    const formData =
      new FormData(formRef.current);

    const website =
      formData
        .get("website")
        ?.toString()
        .trim() || "";

    /*
     * Honeypot.
     * Real users never fill this field.
     */
    if (website) {
      formRef.current.reset();

      setSuccessMessage(
        "Message sent successfully."
      );

      return;
    }

    const messagePayload = {
      name:
        formData
          .get("name")
          ?.toString()
          .trim() || "",

      email:
        formData
          .get("email")
          ?.toString()
          .trim() || "",

      subject:
        formData
          .get("subject")
          ?.toString()
          .trim() || "",

      message:
        formData
          .get("message")
          ?.toString()
          .trim() || "",

      website,
    };

    /*
     * MongoDB is the primary record.
     * Wait for it before sending EmailJS.
     */
    const databaseResponse =
      await fetch(
        "/api/messages",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            messagePayload
          ),
        }
      );

    const databaseData =
      await databaseResponse.json();

    if (!databaseResponse.ok) {
      throw new Error(
        databaseData.message ||
          "Unable to save your message."
      );
    }

    /*
     * Don't send another email
     * notification for duplicate
     * submissions.
     */
    if (!databaseData.duplicate) {
      const serviceId =
        process.env
          .NEXT_PUBLIC_EMAILJS_SERVICE_ID;

      const templateId =
        process.env
          .NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;

      const publicKey =
        process.env
          .NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (
        serviceId &&
        templateId &&
        publicKey
      ) {
        try {
          await emailjs.sendForm(
            serviceId,
            templateId,
            formRef.current,
            {
              publicKey,
            }
          );
        } catch (emailError) {
          /*
           * MongoDB already contains the
           * message, so EmailJS failure
           * should not make the user's
           * submission fail.
           */
          console.error(
            "Email notification failed:",
            emailError
          );
        }
      }
    }

    formRef.current.reset();

    setSuccessMessage(
      databaseData.duplicate
        ? "Your message was already received."
        : "Message sent successfully."
    );
  } catch (error) {
    console.error(
      "Contact form error:",
      error
    );

    setErrorMessage(
      error instanceof Error
        ? error.message
        : "Unable to send the message."
    );
  } finally {
    setSending(false);
  }
}

  const socials = [
    {
      name: "GitHub",
      href: profile.socialLinks.github,
      icon: FaGithub,
    },
    {
      name: "LinkedIn",
      href: profile.socialLinks.linkedin,
      icon: FaLinkedin,
    },
    {
      name: "Instagram",
      href: profile.socialLinks.instagram,
      icon: FaInstagram,
    },
    {
      name: "Facebook",
      href: profile.socialLinks.facebook,
      icon: FaFacebook,
    },
    {
      name: "WhatsApp",
      href: profile.socialLinks.whatsapp,
      icon: FaWhatsapp,
    },
  ].filter((social) => social.href);

  return (
    <section
      id="contact"
      className="border-t border-white/10 bg-[#050505] px-4 py-24 text-white sm:px-6 lg:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-14">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-400">
            07 / Contact
          </p>

          <h2 className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Have something worth building?
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/40">
            {profile.shortBio ||
              "Have a project, collaboration or opportunity in mind? Send a message."}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="border border-white/10 bg-white/[0.02] p-5 sm:p-6 lg:p-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/25">
                Direct Contact
              </p>

              <div className="mt-6 space-y-3">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="group flex items-center gap-4 border border-white/10 px-4 py-4 transition hover:border-cyan-400/30"
                  >
                    <Mail
                      size={17}
                      className="text-cyan-400"
                    />

                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                        Email
                      </p>

                      <p className="mt-1 truncate text-sm text-white/60 group-hover:text-white">
                        {profile.email}
                      </p>
                    </div>
                  </a>
                )}

                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="group flex items-center gap-4 border border-white/10 px-4 py-4 transition hover:border-cyan-400/30"
                  >
                    <Phone
                      size={17}
                      className="text-cyan-400"
                    />

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                        Phone
                      </p>

                      <p className="mt-1 text-sm text-white/60 group-hover:text-white">
                        {profile.phone}
                      </p>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {socials.length > 0 && (
              <div className="mt-8 border-t border-white/10 pt-7">
                <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-white/25">
                  Network
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {socials.map((social) => {
                    const Icon = social.icon;

                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 border border-white/10 px-3 py-3 text-xs text-white/40 transition hover:border-cyan-400/30 hover:text-white"
                      >
                        <Icon
                          size={15}
                          className="text-cyan-400"
                        />

                        {social.name}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-8 border-t border-white/10 pt-7">
              <div className="flex items-center gap-3">
                <span
                  className={`h-2 w-2 rounded-full ${
                    profile.availability
                      ? "bg-emerald-400"
                      : "bg-white/20"
                  }`}
                />

                <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                  {profile.availability
                    ? "Available for opportunities"
                    : "Currently unavailable"}
                </p>
              </div>
            </div>

            {profile.resumeUrl && (
              <div className="mt-6">
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.15em] text-white/50 transition hover:border-cyan-400/30 hover:text-cyan-400"
                >
                  View Resume
                </a>
              </div>
            )}
          </aside>

          <div className="border border-white/10 bg-white/[0.02] p-5 sm:p-6 lg:p-8">
            <div className="mb-7">
              <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-400">
                Message Channel
              </p>

              <h3 className="mt-2 text-2xl font-medium">
                Send a message
              </h3>
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
                <div
  className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
  aria-hidden="true"
>
  <label htmlFor="website">
    Website
  </label>

  <input
    id="website"
    name="website"
    type="text"
    tabIndex={-1}
    autoComplete="off"
  />
</div>
              <div className="grid gap-5 sm:grid-cols-2">
                <ContactInput
                  label="Name"
                  name="name"
                  placeholder="Your name"
                  required
                />

                <ContactInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <ContactInput
                label="Subject"
                name="subject"
                placeholder="Project / opportunity / collaboration"
                required
              />

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/35"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  required
                  rows={7}
                  placeholder="Tell me about what you're working on..."
                  className="w-full resize-y border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400/40"
                />
              </div>

              {successMessage && (
                <div className="border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-300">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="flex w-full items-center justify-center gap-2 bg-cyan-400 px-5 py-4 text-sm font-medium text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <Send size={16} />

                {sending
                  ? "Sending..."
                  : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactInput({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/35"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400/40"
      />
    </div>
  );
}