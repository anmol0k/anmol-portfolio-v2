import { z } from "zod";

export const projectSchema = z.object({
  title: z
    .string()
    .min(2, "Title is required"),

  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain lowercase letters, numbers, and hyphens only"
    ),

  category: z
    .string()
    .optional()
    .default(""),

  year: z
    .string()
    .optional()
    .default(""),

  shortDescription: z
    .string()
    .optional()
    .default(""),

  description: z
    .string()
    .optional()
    .default(""),

  technologies: z
    .array(z.string())
    .default([]),

  thumbnail: z
    .string()
    .optional()
    .default(""),

  thumbnailPublicId: z
    .string()
    .optional()
    .default(""),

  images: z
    .array(z.string())
    .default([]),

  imagePublicIds: z
    .array(z.string())
    .default([]),

  liveUrl: z
    .string()
    .optional()
    .default(""),

  githubUrl: z
    .string()
    .optional()
    .default(""),

  featured: z
    .boolean()
    .default(false),

  order: z
    .number()
    .default(0),

  isActive: z
    .boolean()
    .default(true),
});

export type ProjectInput =
  z.infer<typeof projectSchema>;