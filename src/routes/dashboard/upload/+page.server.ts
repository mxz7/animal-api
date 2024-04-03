import db from "$lib/server/database/database.js";
import { images } from "$lib/server/database/schema.js";
import { imageUpload } from "$lib/zod.js";
import { error, redirect } from "@sveltejs/kit";
import { inArray } from "drizzle-orm";
import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export async function load({ locals, url }) {
  const auth = await locals.validate();

  if (!auth) return redirect(302, `/login?next={${encodeURIComponent(url.pathname)}`);

  const form = await superValidate(zod(imageUpload));

  return { form };
}

export const actions = {
  default: async ({ locals, request }) => {
    const auth = await locals.validate();

    if (!auth) return error(402);

    const form = await superValidate(request, zod(imageUpload));

    if (!form.valid) {
      return fail(400, { form });
    }

    const ids = form.data.ids.split("|");

    await db
      .update(images)
      .set({ type: form.data.type, name: form.data.name })
      .where(inArray(images.id, ids));

    return message(form, { message: `Successfully uploaded ${ids.length} image` });
  },
};
