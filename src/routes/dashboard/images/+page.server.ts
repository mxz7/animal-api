import db from "$lib/server/database/database.js";
import { images } from "$lib/server/database/schema.js";
import { desc, eq } from "drizzle-orm";

export async function load({ setHeaders, parent }) {
  setHeaders({ "cache-control": "max-age=300" });

  const { user } = await parent();

  return {
    images: db
      .select({ id: images.id, type: images.type })
      .from(images)
      .where(eq(images.uploadedBy, user.id))
      .orderBy(desc(images.createdAt)),
  };
}
