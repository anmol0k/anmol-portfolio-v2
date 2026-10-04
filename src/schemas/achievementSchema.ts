import { z } from "zod";

export const achievementSchema = z.object({
  title: z
    .string()
    .min(2, "Title is required"),

  issuer: z
    .string()
    .min(2, "Issuer is required"),

  year: z
    .string()
    .optional()
    .default(""),

  type: z
    .string()
    .optional()
    .default(""),

  status: z
    .string()
    .optional()
    .default(""),

  description: z
    .string()
    .optional()
    .default(""),

  tags: z
    .array(z.string())
    .default([]),

  image: z
    .string()
    .optional()
    .default(""),

  imagePublicId: z
    .string()
    .optional()
    .default(""),

  credentialUrl: z
    .string()
    .optional()
    .default(""),

  order: z
    .number()
    .default(0),

  isActive: z
    .boolean()
    .default(true),
});

export type AchievementInput =
  z.infer<typeof achievementSchema>;