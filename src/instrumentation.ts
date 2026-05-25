/**
 * Next.js instrumentation — runs once when the Node.js server starts.
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateEnv } = await import("@/lib/validators/env");
    validateEnv();
  }
}
