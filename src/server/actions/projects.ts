"use server";

import { verifySession } from "@/lib/auth/verify-session";
import { usersRepository } from "@/server/repositories/users-repository";
import { projectsRepository } from "@/server/repositories";
import { activityLogRepository } from "@/server/repositories";
import type { ActionResult } from "@/types/api";
import type { ProjectDoc } from "@/types/entities";
import { toActionError } from "@/lib/utils/errors";
import { z } from "zod";

const createProjectSchema = z.object({
  name: z.string().min(1).max(80),
  description: z.string().max(500).optional(),
  color: z.string().optional(),
});

export async function listProjects(): Promise<ActionResult<ProjectDoc[]>> {
  try {
    const decoded = await verifySession();
    if (!decoded?.uid) return { success: false, error: "Unauthorized" };

    const user = await usersRepository.getById(decoded.uid);
    if (!user) return { success: false, error: "User not found" };

    const result = await projectsRepository.listByWorkspace(user.workspaceId, {
      orderBy: "updatedAt",
      limit: 50,
    });
    return { success: true, data: result.items };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}

export async function createProject(
  input: z.infer<typeof createProjectSchema>
): Promise<ActionResult<ProjectDoc>> {
  try {
    const decoded = await verifySession();
    if (!decoded?.uid) return { success: false, error: "Unauthorized" };

    const parsed = createProjectSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "Invalid project data" };
    }

    const user = await usersRepository.getById(decoded.uid);
    if (!user) return { success: false, error: "User not found" };

    const id = `proj_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const isFirst =
      (await projectsRepository.listByWorkspace(user.workspaceId, { limit: 1 }))
        .items.length === 0;

    const project = await projectsRepository.create(id, {
      workspaceId: user.workspaceId,
      ownerId: decoded.uid,
      name: parsed.data.name,
      description: parsed.data.description,
      color: parsed.data.color ?? "#8b5cf6",
      isDefault: isFirst,
    });

    await activityLogRepository.log({
      workspaceId: user.workspaceId,
      userId: decoded.uid,
      type: "project_created",
      message: `Created project "${parsed.data.name}"`,
    });

    return { success: true, data: project };
  } catch (error) {
    return { success: false, ...toActionError(error) };
  }
}
