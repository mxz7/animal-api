import { NYPSI_API } from "$env/static/private";
import { nanoid } from "$lib/nanoid.js";
import db from "$lib/server/database/database.js";
import { imageLikes, imageReports, images, users } from "$lib/server/database/schema.js";
import { s3 } from "$lib/server/s3.js";
import { imageReport } from "$lib/zod.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { fail, redirect } from "@sveltejs/kit";
import dayjs from "dayjs";
import { and, count, eq, gt } from "drizzle-orm";
import { message, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export async function load({ params, setHeaders }) {
  setHeaders({ "cache-control": "s-maxage=86400, stale-while-revalidate, max-age=3600" });

  return {
    reportForm: await superValidate({ id: params.id }, zod(imageReport), { errors: false }),
  };
}

export const actions = {
  delete: async ({ locals, params }) => {
    const auth = await locals.validate(false);

    if (!auth.authenticated || auth.user.type !== "admin") return fail(400);

    const [imageData] = await db
      .select({ uploader: { discordId: users.discordId, id: users.id } })
      .from(images)
      .leftJoin(users, eq(users.id, images.uploadedBy))
      .where(eq(images.id, params.id))
      .limit(1);
    await db.delete(images).where(eq(images.id, params.id));
    await s3.send(
      new DeleteObjectCommand({ Bucket: "maxzdev-animals", Key: `${params.type}/${params.id}` }),
    );

    const [{ count: uploadCount }] = await db
      .select({ count: count() })
      .from(images)
      .where(eq(images.uploadedBy, imageData.uploader!.id))
      .limit(1);

    await fetch(`${NYPSI_API}/achievement/animal_lover/progress/${imageData.uploader!.discordId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${NYPSI_API_AUTH}`,
      },
      body: JSON.stringify({
        progress: uploadCount,
      }),
    });

    return redirect(302, "/");
  },
  like: async ({ getClientAddress, params }) => {
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
  report: async ({ request, getClientAddress, params }) => {
    const form = await superValidate(request, zod(imageReport));

    if (!form.valid) {
      return fail(400, { form });
    }

    const dbChecks = await Promise.all([
      db
        .select({ id: imageReports.id })
        .from(imageReports)
        .where(
          and(
            eq(imageReports.createdIp, getClientAddress()),
            gt(imageReports.createdAt, dayjs().subtract(1, "day").toDate().getTime()),
          ),
        )
        .limit(5),
      db
        .select({ id: imageReports.id })
        .from(imageReports)
        .where(
          and(eq(imageReports.createdIp, getClientAddress()), eq(imageReports.imageId, params.id)),
        )
        .limit(1),
    ]);

    if (dbChecks[0].length >= 5) {
      return setError(form, "text", "You've created too many reports recently");
    }

    if (dbChecks[1].length > 0) {
      return setError(form, "text", "You've already reported this image");
    }

    await db.insert(imageReports).values({
      id: nanoid(),
      content: form.data.text,
      imageId: form.data.id,
      createdAt: Date.now(),
      createdIp: getClientAddress(),
    });

    return message(form, "Successfully reported image");
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
