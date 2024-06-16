import db from "$lib/server/database/database.js";
import { images } from "$lib/server/database/schema.js";
import { desc, eq } from "drizzle-orm";

export async function load({ parent }) {
  const { auth } = await parent();

  return {
    images: db
      .select({ id: images.id, type: images.type, verified: images.verified })
      .from(images)
      .where(eq(images.uploadedBy, auth.user.id))
      .orderBy(desc(images.createdAt)),
  };
}
