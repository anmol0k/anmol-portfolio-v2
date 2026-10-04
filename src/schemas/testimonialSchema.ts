import { z } from "zod";

export const testimonialSchema =
  z.object({
    name: z
      .string()
      .min(
        2,
        "Name is required"
      ),

    designation: z
      .string()
      .optional()
      .default(""),

    company: z
      .string()
      .optional()
      .default(""),

    image: z
      .string()
      .optional()
      .default(""),

    imagePublicId: z
      .string()
      .optional()
      .default(""),

    comment: z
      .string()
      .min(
        5,
        "Comment is required"
      ),

    order: z
      .number()
      .default(0),

    isActive: z
      .boolean()
      .default(true),
  });

export type TestimonialInput =
  z.infer<
    typeof testimonialSchema
  >;