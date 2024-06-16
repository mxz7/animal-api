// See https://kit.svelte.dev/docs/types#app

import type { Authed, Unauthed } from "$lib/types/auth";

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      validate: (useApi = true) => Promise<Authed | Unauthed>;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
