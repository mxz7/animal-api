import { lucia } from "$lib/server/auth.js";
import { redirect } from "@sveltejs/kit";

export async function GET({ locals }) {
  const auth = await locals.validate(false);

  if (!auth) return redirect(302, "/");
  lucia.invalidateSession(auth.session.id);
  return redirect(302, "/");
}
