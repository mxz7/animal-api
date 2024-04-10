import { ISR_TOKEN } from "$env/static/private";

export async function invalidateISR(fetch: typeof global.fetch, ...routes: string[]) {
  for (const route of routes) {
    await fetch(route, {
      method: "head",
      headers: {
        "x-prerender-revalidate": ISR_TOKEN,
      },
    });
  }
}
