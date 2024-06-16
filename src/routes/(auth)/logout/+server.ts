import { lucia } from "$lib/server/auth.js";
import { redirect } from "@sveltejs/kit";

export const config = {
  runtime: "edge",
};

export async function GET({ locals }) {
  const auth = await locals.validate(false);

  if (!auth.authenticated) return redirect(302, "/");
  lucia.invalidateSession(auth.session.id);
  return redirect(302, "/");
}
