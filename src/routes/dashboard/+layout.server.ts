import { error, redirect } from "@sveltejs/kit";

export const config = {
  runtime: "edge",
};

export async function load({ locals, url }) {
  const auth = await locals.validate(false);

  if (!auth) return redirect(302, `/login?next=${encodeURIComponent(url.pathname)}`);

  if (auth.user.banned) return error(402);

  return {
    user: auth.user,
  };
}
