import { redirect } from "@sveltejs/kit";

export const config = {
  runtime: "edge",
};

export async function GET({ setHeaders, params }) {
  setHeaders({ "cache-control": "s-maxage=3600, stale-while-revalidate, max-age=3600" });

  return redirect(301, `/api/${params.type}/random`);
}
