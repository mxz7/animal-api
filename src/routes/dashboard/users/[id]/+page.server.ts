import db from "$lib/server/database/database.js";
import { images, users } from "$lib/server/database/schema.js";
import { userEdit } from "$lib/zod.js";
import { fail, redirect } from "@sveltejs/kit";
import { count, eq } from "drizzle-orm";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export async function load({ params, parent, depends }) {
  const { auth } = await parent();

  if (!auth.authenticated || auth.user.type !== "admin") return redirect(302, "/dashboard");

  const { id } = params;

  const query = await db
    .select({
      user: users,
      images: {
        type: images.type,
        count: count(images.type),
      },
    })
    .from(users)
    .leftJoin(images, eq(users.id, images.uploadedBy))
    .where(eq(users.id, id))
    .groupBy(images.type);

  if (!query[0]) return redirect(302, "/dashboard/users");

  const user = query[0].user;
  const imageCounts = query
    .map((row) => {
      if (!row.images?.type) return null;

      return {
        type: row.images?.type,
        count: row.images?.count,
      };
    })
    .filter((i) => Boolean(i)) as { type: string; count: number }[] | null;

  const form = await superValidate(
    { id: user.id, type: user.type as "user" | "mod" | "admin", banned: Boolean(user.banned) },
    zod(userEdit),
  );

  if (user.type === "user") {
    return { user, images: imageCounts, form };
  } else {
    return {
      user,
      images: imageCounts,
      form,
      accepted: db
        .select({ type: images.type, count: count(images.type) })
        .from(images)
        .where(eq(images.acceptedBy, user.id))
        .groupBy(images.type),
    };
  }
}

export const actions = {
  default: async ({ request, locals }) => {
    const auth = await locals.validate(false);

    if (!auth.authenticated || auth.user.type !== "admin") return fail(403);

    const form = await superValidate(request, zod(userEdit));

    if (!form.valid) return fail(400, { form });

    console.log(form);

    await db
      .update(users)
      .set({ type: form.data.type, banned: form.data.banned ? 1 : 0 })
      .where(eq(users.id, form.data.id));

    return message(form, "ok");
  },
};
