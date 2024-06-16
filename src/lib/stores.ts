import { writable } from "svelte/store";
import type { Authed, Unauthed } from "./types/auth";

export const auth = writable<Authed | Unauthed>();

export async function getLocalAuth() {
  const res = await fetch("/api/auth").then((r) => r.json());

  auth.set(res);
}
