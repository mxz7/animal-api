import db from "$lib/server/database/database.js";
import { images } from "$lib/server/database/schema.js";
import { redirect } from "@sveltejs/kit";
import { and, desc, eq } from "drizzle-orm";

export async function load({ params, parent }) {
  const { auth } = await parent();

  if (!auth.authenticated || auth.user.type === "user") return redirect(302, "/dashboard");

  const { type, id, page } = params;

  const result = await db
    .select({ id: images.id, type: images.type, name: images.name, createdAt: images.createdAt })
    .from(images)
    .where(
      and(
        eq(page === "uploaded" ? images.uploadedBy : images.acceptedBy, id),
        eq(images.type, type),
      ),
    )
    .orderBy(desc(images.createdAt));

  return { result };
}
