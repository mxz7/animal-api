import db from "$lib/server/database/database.js";
import { images, users } from "$lib/server/database/schema.js";
import { s3 } from "$lib/server/s3.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { error, fail, redirect } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";

export const config = {
  runtime: "nodejs20.x",
};

export async function load({ parent, params, depends }) {
  const { user } = await parent();
  depends("reviewimage");

  if (user.type === "user") return redirect(302, "/dashboard");

  const [image] = await db
    .select({
      id: images.id,
      ip: images.uploadedIp,
      createdAt: images.createdAt,
      name: images.name,
      uploadedBy: images.uploadedBy,
    })
    .from(images)
    .where(and(eq(images.verified, 0), eq(images.type, params.category)))
    .limit(1);

  if (!image) return redirect(302, "/dashboard/review");

  return {
    image,
  };
}

export const actions = {
  accept: async ({ request, locals }) => {
    const auth = await locals.validate(false);

    if (!auth || !auth.user || auth.user.type === "user") return redirect(302, "/dashboard");

    const data = await request.formData();

    const id = data.get("id")?.toString();

    if (!id) return error(400);

    await db.update(images).set({ verified: 1 }).where(eq(images.id, id));
  },
  deny: async ({ request, locals }) => {
    const auth = await locals.validate(false);

    if (!auth || !auth.user || auth.user.type === "user") return redirect(302, "/dashboard");

    const data = await request.formData();

    const id = data.get("id")?.toString();

    if (!id) return fail(400);

    await db.delete(images).where(eq(images.id, id));
    await s3.send(new DeleteObjectCommand({ Bucket: "maxzdev-animals", Key: id }));
  },
  denyAll: async ({ locals, params }) => {
    const auth = await locals.validate(false);

    if (!auth || !auth.user || auth.user.type !== "admin") return redirect(302, "/dashboard");

    const ids = await db
      .delete(images)
      .where(and(eq(images.verified, 0), eq(images.type, params.category)))
      .returning({ id: images.id });

    for (const { id } of ids) {
      await s3.send(new DeleteObjectCommand({ Bucket: "maxzdev-animals", Key: id }));
    }
  },
  ban: async ({ locals, request }) => {
    const auth = await locals.validate(false);

    if (!auth || !auth.user || auth.user.type !== "admin") return redirect(302, "/dashboard");

    const data = await request.formData();

    const userId = data.get("userid")?.toString();

    if (!userId) return fail(400);

    await db.update(users).set({ banned: 1 }).where(eq(users.id, userId));
    const ids = await db
      .delete(images)
      .where(and(eq(images.verified, 0), eq(images.uploadedBy, userId)))
      .returning({ id: images.id });

    for (const { id } of ids) {
      await s3.send(new DeleteObjectCommand({ Bucket: "maxzdev-animals", Key: id }));
    }
  },
};
