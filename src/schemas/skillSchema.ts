import { z } from "zod";

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),

  category: z.string().min(1, "Category is required"),

  icon: z.string().optional().default(""),

  order: z.number().default(0),

  isActive: z.boolean().default(true),
});

export type SkillInput = z.infer<typeof skillSchema>;