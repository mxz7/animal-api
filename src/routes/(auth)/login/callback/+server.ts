import { nanoid } from "$lib/nanoid.js";
import { discord, lucia } from "$lib/server/auth.js";
import db from "$lib/server/database/database.js";
import { users } from "$lib/server/database/schema.js";
import { error, redirect } from "@sveltejs/kit";
import { OAuth2RequestError } from "arctic";
import { and, eq } from "drizzle-orm";

export const config = {
  runtime: "edge",
};

export async function GET({ cookies, url, getClientAddress }) {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies.get("oauth_state") ?? null;
  const next = cookies.get("login_next") ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    console.warn("invalid callback");
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await discord.validateAuthorizationCode(code);
    const response = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const user: DiscordUser = await response.json();

    const [existingUser] = await db
      .select({ id: users.id, banned: users.banned })
      .from(users)
      .where(eq(users.discordId, user.id))
      .limit(1);

    if (existingUser?.banned) return error(402);

    const banned = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.banned, 1), eq(users.createdIp, getClientAddress())));

    if (banned.length > 0) return error(402);

    if (existingUser) {
      await db.update(users).set({ username: user.username }).where(eq(users.id, existingUser.id));
      const session = await lucia.createSession(existingUser.id, {});

      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes,
      });
    } else {
      const [newUser] = await db
        .insert(users)
        .values({
          id: nanoid(),
          discordId: user.id,
          createdAt: Date.now(),
          createdIp: getClientAddress(),
        })
        .returning({ id: users.id });

      const banned = await db
        .select({ id: users.id })
        .from(users)
        .where(and(eq(users.banned, 1), eq(users.createdIp, getClientAddress())));

      if (banned.length > 0) return error(402);

      const session = await lucia.createSession(newUser.id, {});

      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes,
      });
    }
  } catch (e) {
    console.error(e);
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }

  return redirect(302, next || "/");
}

interface DiscordUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
}
