import { initializeApp, getApps, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import type { FirebasePublicConfig } from "@/lib/auth/client-config";
import { isFirebasePublicConfigValid } from "@/lib/auth/client-config";

let injectedConfig: FirebaseOptions | null = null;

/** Called from AppProviders with config read on the server from .env */
export function injectFirebaseConfig(config: FirebasePublicConfig): void {
  if (isFirebasePublicConfigValid(config)) {
    injectedConfig = {
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId,
    };
  }
}

function resolveFirebaseOptions(): FirebaseOptions {
  if (injectedConfig) return injectedConfig;
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

export function getFirebaseApp(): FirebaseApp {
  if (!getApps().length) {
    const options = resolveFirebaseOptions();
    if (!options.apiKey || !options.projectId) {
      throw new Error(
        "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* to .env.local and restart the dev server."
      );
    }
    app = initializeApp(options);
  } else {
    app = getApps()[0]!;
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

export function getFirebaseDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}

export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });
