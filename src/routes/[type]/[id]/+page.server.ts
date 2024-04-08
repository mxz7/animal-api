import db from "$lib/server/database/database.js";
import { imageLikes, images, users } from "$lib/server/database/schema.js";
import { fail } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function load({ locals }) {
  return { user: locals.validate().then((auth) => auth?.user) };
}

export const actions = {
  delete: async ({ locals, params }) => {
    const auth = await locals.validate();

    if (!auth || auth.user.type !== "admin") return fail(400);

    await db.delete(images).where(eq(images.id, `${params.type}/${params.id}`));
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
        imageId: `${params.type}/${params.id}`,
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
