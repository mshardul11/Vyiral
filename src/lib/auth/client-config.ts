/** Client-safe Firebase configuration checks */

const REQUIRED_PUBLIC_KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

export type FirebasePublicConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

function envValue(key: string): string {
  return (process.env[key] ?? "").trim();
}

function isSet(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

/** Read Firebase web config from server env (reliable in RSC / Node) */
export function getFirebasePublicConfig(): FirebasePublicConfig {
  return {
    apiKey: envValue("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: envValue("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: envValue("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: envValue("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: envValue("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: envValue("NEXT_PUBLIC_FIREBASE_APP_ID"),
  };
}

export function getFirebaseConfigStatus(): {
  configured: boolean;
  missing: string[];
} {
  const missing = REQUIRED_PUBLIC_KEYS.filter(
    (key) => !isSet(process.env[key])
  );
  return {
    configured: missing.length === 0,
    missing: [...missing],
  };
}

export function isFirebasePublicConfigValid(
  config: FirebasePublicConfig
): boolean {
  return Boolean(
    config.apiKey &&
      config.authDomain &&
      config.projectId &&
      config.appId
  );
}

export function isFirebaseConfigured(): boolean {
  return getFirebaseConfigStatus().configured;
}
