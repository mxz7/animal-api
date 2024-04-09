import { redirect } from "@sveltejs/kit";

export async function GET() {
  return redirect(302, "/dashboard/images");
}
