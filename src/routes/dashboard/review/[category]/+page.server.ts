import db from "$lib/server/database/database.js";
import { images } from "$lib/server/database/schema.js";
import { s3 } from "$lib/server/s3.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { error, redirect } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";

export async function load({ parent, params }) {
  const { user } = await parent();

  if (user.type === "user") return redirect(302, "/dashboard");

  const [image] = await db
    .select({
      id: images.id,
      ip: images.uploadedIp,
      createdAt: images.createdAt,
      name: images.name,
    })
    .from(images)
    .where(and(eq(images.verified, 0), eq(images.type, params.category)))
    .limit(1);

  return {
    image,
  };
}

export const actions = {
  accept: async ({ request, locals }) => {
    const auth = await locals.validate();

    if (!auth || !auth.user || auth.user.type === "user") return redirect(302, "/dashboard");

    const data = await request.formData();

    const id = data.get("id")?.toString();

    if (!id) return error(400);

    await db.update(images).set({ verified: 1 }).where(eq(images.id, id));
  },
  deny: async ({ request, locals }) => {
    const auth = await locals.validate();

    if (!auth || !auth.user || auth.user.type === "user") return redirect(302, "/dashboard");

    const data = await request.formData();

    const id = data.get("id")?.toString();

    if (!id) return error(400);

    await db.delete(images).where(eq(images.id, id));
    await s3.send(new DeleteObjectCommand({ Bucket: "maxzdev-animals", Key: id }));
  },
};
