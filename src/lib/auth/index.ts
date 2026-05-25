export {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_MS,
} from "@/lib/auth/session";

export { verifySession, requireSession } from "@/lib/auth/verify-session";

export {
  resolveSessionUser,
  getWorkspaceContext,
  requireWorkspaceContext,
  type WorkspaceContext,
} from "@/lib/auth/server";

export { withAuthRoute } from "@/lib/auth/api-route";
export { withAuthAction } from "@/lib/auth/action";

export {
  isFirebaseConfigured,
  getFirebaseConfigStatus,
} from "@/lib/auth/client-config";
