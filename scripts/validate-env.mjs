#!/usr/bin/env node
/**
 * Validates production env before deploy. Loads .env.local if present.
 * Usage: node scripts/validate-env.mjs
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const root = resolve(process.cwd());
const envPath = resolve(root, ".env.local");

if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

process.env.NODE_ENV = "production";

const required = {
  client: [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_APP_URL",
  ],
  server: [
    "FIREBASE_ADMIN_PROJECT_ID",
    "FIREBASE_ADMIN_CLIENT_EMAIL",
    "FIREBASE_ADMIN_PRIVATE_KEY",
  ],
};

const missing = [];
for (const key of [...required.client, ...required.server]) {
  if (!process.env[key]?.trim()) missing.push(key);
}

if (missing.length) {
  console.error("[Vyiral] Missing required environment variables:\n");
  for (const key of missing) console.error(`  - ${key}`);
  console.error("\nCopy .env.example → .env.local and fill values before deploying.");
  process.exit(1);
}

console.log("[Vyiral] Environment validation passed.");
