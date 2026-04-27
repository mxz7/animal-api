# Animal API — Agent Instructions

A full-stack SvelteKit app that serves random animal images via a public REST API, with a Discord-authenticated admin dashboard for uploading and moderating content. Deployed on Vercel with Turso (serverless SQLite) and S3-compatible storage.

## Commands

```bash
pnpm dev          # Start dev server (Vite)
pnpm build        # Production build
pnpm check        # Type-check (svelte-kit sync + svelte-check)
pnpm lint         # Check formatting (Prettier)
pnpm format       # Auto-format (Prettier)
```

No test suite is configured.

For database migrations, use Drizzle Kit:

```bash
pnpm drizzle-kit generate   # Generate SQL migration from schema changes
pnpm drizzle-kit migrate    # Apply pending migrations to Turso DB
```

## Architecture

```
src/lib/server/database/schema.ts   # Drizzle schema (single source of truth)
src/lib/server/database/database.ts # Turso client + Drizzle instance
src/lib/server/auth.ts              # Lucia + Arctic (Discord OAuth)
src/lib/server/s3.ts                # S3 client, presigned upload URLs
src/lib/server/cache.ts             # ISR revalidation helper
src/lib/types/                      # Shared TypeScript types (api.ts, auth.ts)
src/routes/api/[type]/              # Public REST API endpoints
src/routes/dashboard/               # Protected admin area (mod/admin roles)
src/routes/(auth)/                  # Discord OAuth login/callback/logout
```

**User roles:** `user` (default) · `mod` · `admin` — stored in `users.type`.

## Key Conventions

- **Svelte 5** — uses the runes API (`$state`, `$derived`, `$effect`). State shared across components lives in `.svelte.ts` files (see `src/lib/state.svelte.ts`).
- **Route files**: `+page.server.ts` for load functions and form actions; `+server.ts` for API endpoints; `+layout.server.ts` for auth guards and shared data.
- **IDs** are Nanoid strings (see `src/lib/nanoid.ts`), not auto-increment integers.
- **Timestamps** are stored as Unix milliseconds. SQLite booleans are integers (0/1), e.g. `images.verified`.
- **DB column names** are snake_case; TypeScript properties are camelCase (Drizzle maps these).
- **Animal type parameter** must always be lowercased before DB queries (routes do `.toLowerCase()`).
- **Form validation** uses Zod schemas from `src/lib/zod.ts` combined with sveltekit-superforms.

## Environment Variables

| Variable           | Purpose                                         |
| ------------------ | ----------------------------------------------- |
| `DB_URL`           | Turso database URL                              |
| `DB_TOKEN`         | Turso auth token                                |
| `DISCORD_CLIENTID` | Discord OAuth app client ID                     |
| `DISCORD_SECRET`   | Discord OAuth app secret                        |
| `DISCORD_REDIRECT` | Discord OAuth redirect URI                      |
| `S3_ENDPOINT`      | S3-compatible storage endpoint                  |
| `S3_KEY_ID`        | S3 access key ID                                |
| `S3_ACCESS_KEY`    | S3 secret access key                            |
| `ISR_TOKEN`        | Vercel ISR bypass/revalidation token            |
| `PUBLIC_URL`       | Public base URL (e.g. `https://animal-api.com`) |
| `PUBLIC_CDN_URL`   | CDN base URL for image assets                   |

## Deployment & Caching

The app runs on Vercel. Most public API routes use **ISR (Incremental Static Regeneration)** for caching:

- Routes export `export const isr = { expiration, bypassToken }` to opt in.
- Routes export `export const runtime = "edge"` for edge-cached endpoints (auth check, random, types).
- `src/lib/server/cache.ts` has helpers for triggering ISR revalidation via `ISR_TOKEN`.
- A daily cron job (`0 0 * * *`) hits `/api/checkpending` (configured in `vercel.json`).

## Pitfalls

- **`JSON.stringify` fails on BigInt.** Turso can return BigInt for integer columns. Always use a serializer/reviver or `Number()` cast before stringifying DB results.
- **Edge runtime limitations.** Endpoints with `runtime: "edge"` cannot use Node.js-only APIs. Keep them lean.
- **S3 uploads are browser-direct.** The server creates a presigned URL (valid 300 s); the client uploads directly to S3. Do not send file data through the SvelteKit server.
- **IP tracking is used for bans.** `createdIp` is stored on users and image interactions. When adding new content-creation routes, include IP capture consistent with existing routes.
