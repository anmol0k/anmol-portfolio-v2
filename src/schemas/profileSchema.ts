import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required"),

  title: z
    .string()
    .min(2, "Title is required"),

  shortBio: z
    .string()
    .optional()
    .default(""),

  about: z
    .string()
    .optional()
    .default(""),

  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .optional()
    .default(""),

  resumeUrl: z
    .string()
    .optional()
    .default(""),

  resumePublicId: z
    .string()
    .optional()
    .default(""),

  profileImage: z
    .string()
    .optional()
    .default(""),

  profileImagePublicId: z
    .string()
    .optional()
    .default(""),

  availability: z
    .boolean()
    .default(true),

  socialLinks: z.object({
    github: z
      .string()
      .optional()
      .default(""),

    linkedin: z
      .string()
      .optional()
      .default(""),

    instagram: z
      .string()
      .optional()
      .default(""),

    facebook: z
      .string()
      .optional()
      .default(""),

    whatsapp: z
      .string()
      .optional()
      .default(""),
  }),
});

export type ProfileInput =
  z.infer<typeof profileSchema>;