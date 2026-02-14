import { z } from "zod";

/**
 * Server-side and build-time environment variables.
 * Validated at startup so missing/invalid config fails fast.
 */
const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().min(1, "DIRECT_URL is required"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
});

/**
 * Client-side (NEXT_PUBLIC_*) environment variables.
 * Exposed to the browser; only put non-sensitive values here.
 */
const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
});

/**
 * Validate server env (use in server code, API routes, getServerSideProps, etc.)
 */
function validateServerEnv() {
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    const message = parsed.error.flatten().fieldErrors;
    throw new Error(
      `Invalid server environment variables:\n${JSON.stringify(message, null, 2)}`
    );
  }
  return parsed.data;
}

/**
 * Validate client env (use where NEXT_PUBLIC_* vars are read).
 */
function validateClientEnv() {
  const parsed = clientSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  if (!parsed.success) {
    const message = parsed.error.flatten().fieldErrors;
    throw new Error(
      `Invalid client environment variables:\n${JSON.stringify(message, null, 2)}`
    );
  }
  return parsed.data;
}

export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;

/** Only validated on server; do not use in client components. */
export const serverEnv =
  typeof window === "undefined" ? validateServerEnv() : ({} as ServerEnv);

export const clientEnv = validateClientEnv();
