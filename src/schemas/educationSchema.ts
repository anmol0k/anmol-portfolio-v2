import { z } from "zod";

export const educationSchema = z.object({
  degree: z.string().min(2, "Degree is required"),

  institution: z.string().min(2, "Institution is required"),

  period: z.string().min(2, "Period is required"),

  status: z.string().optional().default(""),

  score: z.string().optional().default(""),

  description: z.string().optional().default(""),

  subjects: z.array(z.string()).default([]),

  order: z.number().default(0),

  isActive: z.boolean().default(true),
});

export type EducationInput = z.infer<typeof educationSchema>;