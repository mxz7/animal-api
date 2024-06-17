import { boolean, object, string, enum as zodEnum } from "zod";

export const imageUpload = object({
  sizes: string(),
  types: string(),
  category: string()
    .toLowerCase()
    .trim()
    .regex(/^[A-Za-z]+$/, "Letters only"),
  name: string()
    .trim()
    .regex(/^[A-Za-z\s]+$/, "Letters only")
    .optional(),
});

export const imageReport = object({
  id: string(),
  text: string().min(3).max(100).trim(),
});

export const userEdit = object({
  id: string(),
  type: zodEnum(["user", "mod", "admin"]),
  banned: boolean(),
});
