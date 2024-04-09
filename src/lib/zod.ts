import { object, string } from "zod";

export const imageUpload = object({
  sizes: string(),
  types: string(),
  category: string()
    .toLowerCase()
    .trim()
    .regex(/^[A-Za-z]+$/, "Letters only"),
  name: string()
    .trim()
    .regex(/^[A-Za-z]+$/, "Letters only")
    .optional(),
});
