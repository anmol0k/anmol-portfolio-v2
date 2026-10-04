import { z } from "zod";

export const experienceSchema = z.object({
  role: z.string().min(2, "Role is required"),

  company: z.string().min(2, "Company is required"),

  period: z.string().min(2, "Period is required"),

  type: z.string().optional().default(""),

  description: z.string().optional().default(""),

  highlights: z.array(z.string()).default([]),

  order: z.number().default(0),

  isActive: z.boolean().default(true),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;