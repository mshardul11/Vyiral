"use client";

import { useWorkspace } from "@/contexts/workspace-context";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyState } from "@/components/shared/empty-state";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { FolderKanban, Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsPage() {
  const { projects, activeProject, setActiveProjectId, createNewProject, loading } =
    useWorkspace();
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");

  async function handleCreate() {
    if (!name.trim()) return;
    const ok = await createNewProject(name.trim());
    if (ok) {
      setName("");
      setCreateOpen(false);
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader
        title="Projects"
        description="Organize keywords, titles, tags, descriptions, ideas, and audits per campaign."
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            New project
          </Button>
        }
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create a project to group saved keywords, AI outputs, and audits."
          action={{ label: "Create project", onClick: () => setCreateOpen(true) }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <GlassCard
              key={p.id}
              hover
              className={
                activeProject?.id === p.id ? "ring-2 ring-primary/50" : ""
              }
            >
              <button
                type="button"
                className="w-full text-left"
                onClick={() => setActiveProjectId(p.id)}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: p.color ?? "#8b5cf6" }}
                  />
                  {p.isDefault && <Badge variant="muted">Default</Badge>}
                </div>
                <h3 className="mt-3 font-semibold">{p.name}</h3>
                {p.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {p.description}
                  </p>
                )}
              </button>
            </GlassCard>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="proj-name">Name</Label>
              <Input
                id="proj-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Launch campaign"
              />
            </div>
            <Button className="w-full" onClick={handleCreate} disabled={!name.trim()}>
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
