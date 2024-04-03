import { object, string } from "zod";

export const imageUpload = object({
  type: string().toLowerCase().min(3).max(100),
  ids: string(),
  name: string().optional(),
});
