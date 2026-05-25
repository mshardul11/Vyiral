"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/contexts/auth-context";
import { listProjects, createProject } from "@/server/actions/projects";
import type { ProjectDoc } from "@/types/entities";

interface WorkspaceContextValue {
  projects: ProjectDoc[];
  activeProject: ProjectDoc | null;
  setActiveProjectId: (id: string | null) => void;
  refreshProjects: () => Promise<void>;
  createNewProject: (name: string, description?: string) => Promise<boolean>;
  loading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(
  undefined
);

const PROJECT_STORAGE_KEY = "vyiral-active-project";

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { userDoc } = useAuth();
  const [projects, setProjects] = useState<ProjectDoc[]>([]);
  const [activeProjectId, setActiveProjectIdState] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const refreshProjects = useCallback(async () => {
    const result = await listProjects();
    if (result.success && result.data) {
      setProjects(result.data);
      const stored = localStorage.getItem(PROJECT_STORAGE_KEY);
      const defaultProject =
        result.data.find((p) => p.id === stored) ??
        result.data.find((p) => p.isDefault) ??
        result.data[0] ??
        null;
      if (defaultProject && !activeProjectId) {
        setActiveProjectIdState(defaultProject.id);
      }
    }
    setLoading(false);
  }, [activeProjectId]);

  useEffect(() => {
    if (userDoc?.workspaceId) {
      void refreshProjects();
    } else {
      setLoading(false);
    }
  }, [userDoc?.workspaceId, refreshProjects]);

  const setActiveProjectId = useCallback((id: string | null) => {
    setActiveProjectIdState(id);
    if (id) localStorage.setItem(PROJECT_STORAGE_KEY, id);
    else localStorage.removeItem(PROJECT_STORAGE_KEY);
  }, []);

  const createNewProject = useCallback(
    async (name: string, description?: string) => {
      const result = await createProject({ name, description });
      if (result.success && result.data) {
        await refreshProjects();
        setActiveProjectId(result.data.id);
        return true;
      }
      return false;
    },
    [refreshProjects, setActiveProjectId]
  );

  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeProjectId) ?? null,
    [projects, activeProjectId]
  );

  const value = useMemo(
    () => ({
      projects,
      activeProject,
      setActiveProjectId,
      refreshProjects,
      createNewProject,
      loading,
    }),
    [
      projects,
      activeProject,
      setActiveProjectId,
      refreshProjects,
      createNewProject,
      loading,
    ]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}
