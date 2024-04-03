import { dev } from "$app/environment";
import { DISCORD_CLIENTID, DISCORD_REDIRECT, DISCORD_SECRET } from "$env/static/private";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Discord } from "arctic";
import { Lucia } from "lucia";
import db from "./database/database";
import { sessions, users } from "./database/schema";

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: !dev,
    },
  },
  getUserAttributes: (attributes) => {
    return attributes;
  },
});

export const discord = new Discord(DISCORD_CLIENTID, DISCORD_SECRET, DISCORD_REDIRECT);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  discordId: string;
  type: string;
  banned: number;
}
