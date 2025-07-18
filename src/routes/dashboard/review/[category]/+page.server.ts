import { NYPSI_API, NYPSI_API_AUTH } from "$env/static/private";
import { invalidateISR } from "$lib/server/cache.js";
import db from "$lib/server/database/database.js";
import { images, users } from "$lib/server/database/schema.js";
import { s3 } from "$lib/server/s3.js";
import { CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { error, fail, redirect } from "@sveltejs/kit";
import { and, count, eq, not } from "drizzle-orm";

export const config = {
  runtime: "nodejs20.x",
};

export async function load({ parent, params, depends }) {
  const { auth } = await parent();
  depends("reviewimage");

  if (auth.authenticated && auth.user.type === "user") return redirect(302, "/dashboard");

  const [image] = await db
    .select({
      id: images.id,
      ip: images.uploadedIp,
      createdAt: images.createdAt,
      name: images.name,
      uploadederUsername: users.username,
      uploaderId: images.uploadedBy,
      type: images.type,
    })
    .from(images)
    .leftJoin(users, eq(users.id, images.uploadedBy))
    .where(
      and(
        eq(images.verified, 0),
        eq(images.type, params.category),
        not(eq(images.uploadedBy, auth.user.id)),
      ),
    )
    .limit(1);

  if (!image) return redirect(302, "/dashboard/review");

  return {
    image,
  };
}

export const actions = {
  accept: async ({ request, locals, fetch, params }) => {
    const auth = await locals.validate(false);

    if (!auth.authenticated || !auth.user || auth.user.type === "user")
      return redirect(302, "/dashboard");

    const data = await request.formData();

    const id = data.get("id")?.toString();

    if (!id) return error(400);

    const promises: Promise<any>[] = [];

    promises.push(
      db.update(images).set({ verified: 1, acceptedBy: auth.user.id }).where(eq(images.id, id)),
    );
    promises.push(invalidateISR(fetch, `/api/${params.category}/count`));

    const [uploader] = await db
      .select({ id: users.id, discordId: users.discordId })
      .from(images)
      .where(eq(images.id, id))
      .leftJoin(users, eq(users.id, images.uploadedBy))
      .limit(1);

    if (uploader.id) {
      const [{ count: imageCount }] = await db
        .select({ count: count() })
        .from(images)
        .where(and(eq(images.uploadedBy, uploader.id), not(eq(images.id, id))));

      promises.push(
        fetch(`${NYPSI_API}/achievement/animal_lover/progress/${uploader.discordId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${NYPSI_API_AUTH}`,
          },
          body: JSON.stringify({ progress: imageCount }),
        }),
      );
    }

    await Promise.all(promises);
  },
  deny: async ({ request, locals, params }) => {
    const auth = await locals.validate(false);

    if (!auth.authenticated || !auth.user || auth.user.type === "user")
      return redirect(302, "/dashboard");

    const data = await request.formData();

    const id = data.get("id")?.toString();

    if (!id) return fail(400);

    await db.delete(images).where(eq(images.id, id));
    await s3.send(
      new DeleteObjectCommand({ Bucket: "maxzdev-animals", Key: `${params.category}/${id}` }),
    );
  },
  changeType: async ({ request, locals }) => {
    const auth = await locals.validate(false);

    if (!auth.authenticated || !auth.user || auth.user.type === "user")
      return redirect(302, "/dashboard");

    const data = await request.formData();

    const id = data.get("id")?.toString();
    const type = data.get("type")?.toString();

    if (!type || !id) return fail(400);

    const [oldType] = await db.select({ type: images.type }).from(images).where(eq(images.id, id));

    if (!oldType) return fail(400);
    await db.update(images).set({ type }).where(eq(images.id, id));

    await s3.send(
      new CopyObjectCommand({
        Bucket: "maxzdev-animals",
        CopySource: `/maxzdev-animals/${oldType.type}/${id}`, // requires bucket at start for some reason
        Key: `${type}/${id}`,
      }),
    );

    await s3.send(
      new DeleteObjectCommand({ Bucket: "maxzdev-animals", Key: `${oldType.type}/${id}` }),
    );
  },
  denyAll: async ({ locals, params }) => {
    const auth = await locals.validate(false);

    if (!auth.authenticated || !auth.user || auth.user.type !== "admin")
      return redirect(302, "/dashboard");

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

    if (!auth.authenticated || !auth.user || auth.user.type !== "admin")
      return redirect(302, "/dashboard");

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
