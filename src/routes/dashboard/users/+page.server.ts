import db from "$lib/server/database/database.js";
import { images, users } from "$lib/server/database/schema.js";
import { redirect } from "@sveltejs/kit";
import { count, desc, eq } from "drizzle-orm";

const PER_PAGE = 15;

export async function load({ url, parent }) {
  const { auth } = await parent();

  if (!auth.authenticated || auth.user.type !== "admin") return redirect(302, "/dashboard");

  let page = parseInt(url.searchParams.get("page") || "1") || 1;

  if (page < 1) page = 1;

  const [rows, amount] = await Promise.all([
    db
      .select({
        id: users.id,
        username: users.username,
        createdAt: users.createdAt,
        type: users.type,
        banned: users.banned,
        uploaded: count(images.id),
      })
      .from(users)
      .leftJoin(images, eq(images.uploadedBy, users.id))
      .groupBy(users.id)
      .limit(PER_PAGE)
      .offset((page - 1) * PER_PAGE)
      .orderBy(desc(users.createdAt)),

    db.select({ amount: count() }).from(users),
  ]);

  const lastPage = Math.floor(amount[0].amount / PER_PAGE) + 1;

  return { rows, page, lastPage };
}
