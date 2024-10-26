import type { Authed, Unauthed } from "./types/auth";

export const auth: { value: Authed | Unauthed | null } = $state({ value: null });

export async function getLocalAuth() {
  const res = await fetch("/api/auth").then((r) => r.json());

  auth.value = res;
}
