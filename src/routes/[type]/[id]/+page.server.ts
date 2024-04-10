import { ISR_TOKEN } from "$env/static/private";
import { nanoid } from "$lib/nanoid.js";
import db from "$lib/server/database/database.js";
import { imageLikes, images, users } from "$lib/server/database/schema.js";
import { s3 } from "$lib/server/s3.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { fail, redirect } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";

export const config = {
  isr: {
    expiration: 43200,
    bypassToken: ISR_TOKEN,
  },
};

export const actions = {
  delete: async ({ locals, params }) => {
    const auth = await locals.validate(false);

    if (!auth || auth.user.type !== "admin") return fail(400);

    await db.delete(images).where(eq(images.id, params.id));
    await s3.send(
      new DeleteObjectCommand({ Bucket: "maxzdev-animals", Key: `${params.type}/${params.id}` }),
    );
    return redirect(302, "/");
  },
  addLike: async ({ getClientAddress, params }) => {
    if (await banCheck(getClientAddress())) return fail(400);

    let broke = false;

    await db
      .insert(imageLikes)
      .values({
        id: nanoid(),
        createdAt: Date.now(),
        createdIp: getClientAddress(),
        imageId: params.id,
      })
      .catch(() => (broke = true));

    if (broke) return fail(400);

    return true;
  },
};

async function banCheck(ip: string) {
  const query = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.createdIp, ip), eq(users.banned, 1)));

  if (query.length > 0) return true;
  return false;
}
