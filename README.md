# News Listing Application

A lightweight news listing application with an admin panel for content management and a public landing page with date filtering.

## Environment variables

The app uses environment variables for database, Supabase, and NextAuth. **Never commit real secrets**; use `.env.local` for local development and set variables in your host (e.g. Vercel) for production.

### 1. Copy the template

```bash
cp .env.example .env.local
```

### 2. Fill in `.env.local`

Edit `.env.local` and set:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string (Prisma) | `postgresql://user:pass@host:5432/db?schema=public` |
| `DIRECT_URL` | Direct PostgreSQL URL (migrations) | Same as `DATABASE_URL` or connection pooler URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous (public) key | From Supabase dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) | From same API settings; keep secret |
| `NEXTAUTH_URL` | Full URL of your app | `http://localhost:3000` (dev) or your production URL |
| `NEXTAUTH_SECRET` | Secret for signing sessions | e.g. `openssl rand -base64 32` |
| `NODE_ENV` | Environment mode | `development` or `production` |

### 3. Validation

The project uses **Zod** in `lib/env.ts` to validate required variables at runtime. If something is missing or invalid, the app will throw a clear error when that config is used (server env is validated only on the server).

### 4. Security

- `.env.local` and other `.env*.local` files are in `.gitignore` and must not be committed.
- Use `.env.example` as the template only (no real values).
- In production, set variables in your hosting provider (e.g. Vercel project settings).

## Getting started

After setting up environment variables:

```bash
npm install
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
