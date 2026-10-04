import { z } from "zod";

export const messageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  subject: z
    .string()
    .trim()
    .min(1, "Subject is required"),

  message: z
    .string()
    .trim()
    .min(1, "Message is required"),
});

export type MessageInput =
  z.infer<typeof messageSchema>;