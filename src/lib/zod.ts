import { object, string } from "zod";

export const imageUpload = object({
  sizes: string(),
  types: string(),
  category: string().toLowerCase(),
  name: string().optional(),
});
