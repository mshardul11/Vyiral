import type { ActionResult } from "@/types/api";
import {
  getWorkspaceContext,
  requireWorkspaceContext,
  type WorkspaceContext,
} from "@/lib/auth/server";
import { toActionError } from "@/lib/utils/errors";

/** Run a server action only when authenticated; returns ActionResult */
export async function withAuthAction<T>(
  fn: (ctx: WorkspaceContext) => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const ctx = await requireWorkspaceContext();
    const data = await fn(ctx);
    return { success: true, data };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}

export { getWorkspaceContext, requireWorkspaceContext, type WorkspaceContext };
