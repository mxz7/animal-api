import { DB_TOKEN, DB_URL } from "$env/static/private";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({ url: DB_URL, authToken: DB_TOKEN });

const db = drizzle(client);

export default db;
