import { error, redirect } from "@sveltejs/kit";

export async function load({ fetch, params }) {
  const res = await fetch(`/api/${params.type.toLowerCase()}/random`);

  if (!res.ok) return error(404, { message: "Unsupported animal type" });

  const { url } = await res.json();

  return redirect(302, url);
}
