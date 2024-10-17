import { TELEGRAM_CHAT_ID, TELEGRAM_TOKEN } from "$env/static/private";
import db from "$lib/server/database/database";
import { images } from "$lib/server/database/schema";
import { count, eq } from "drizzle-orm";

export async function GET({ request }) {
  const [{ amount }] = await db
    .select({ amount: count() })
    .from(images)
    .where(eq(images.verified, 0))
    .limit(1);

  if (amount > 0) {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: `There are ${amount} images waiting to be verified`,
      }),
    });

    if (!res.ok) console.error("failed to send pending verification notif");
  }

  return new Response(null, {
    status: 200,
  });
}
