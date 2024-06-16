import { nanoid } from "$lib/nanoid.js";
import db from "$lib/server/database/database.js";
import { images } from "$lib/server/database/schema.js";
import { createPresignedUpload } from "$lib/server/s3.js";
import { imageUpload } from "$lib/zod.js";
import { error, redirect } from "@sveltejs/kit";
import { fail, message, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export async function load({ locals, url, parent }) {
  const { auth } = await parent();

  if (!auth.authenticated) return redirect(302, `/login?next={${encodeURIComponent(url.pathname)}`);

  const form = await superValidate(zod(imageUpload));

  return { form };
}

export const actions = {
  default: async ({ locals, request, getClientAddress }) => {
    const auth = await locals.validate(false);

    if (!auth.authenticated) return error(402);

    const form = await superValidate(request, zod(imageUpload));

    if (!form.valid) {
      return fail(400, { form });
    }

    const types = form.data.types.split("||");
    const sizes = form.data.sizes.split("||");

    console.log(types);
    console.log(sizes);

    if (types.length !== sizes.length) {
      return setError(form, "types", "Mismatched types and sizes. Please refresh and try again");
    }

    const urls: string[] = [];

    for (let i = 0; i < types.length; i++) {
      const size = sizes[i];
      const type = types[i];

      if (!["image/jpeg", "image/png"].includes(type)) {
        return setError(form, "types", "Invalid file type. Only JPEG and PNG supported");
      }

      const id = nanoid();

      urls.push(await createPresignedUpload(type, size, `${form.data.category}/${id}`));
      await db.insert(images).values({
        id: id,
        createdAt: Date.now(),
        type: form.data.category,
        uploadedIp: getClientAddress(),
        uploadedBy: auth.user.id,
        name: form.data.name,
        verified: 0,
      });
    }

    return message(form, { urls: urls });
  },
};
