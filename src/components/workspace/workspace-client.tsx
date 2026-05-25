"use client";

import { useState } from "react";
import { Users, UserPlus, Shield, Crown, Edit, Eye, Clock, Activity, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Role = "owner" | "admin" | "editor" | "viewer";

interface Member {
  id: string;
  displayName: string;
  email: string;
  role: Role;
  joinedAt: string;
  lastActive: string;
  avatar: string;
}

const ROLE_CONFIG: Record<Role, { label: string; color: string; Icon: React.ElementType; desc: string }> = {
  owner: { label: "Owner", color: "bg-amber-500/10 text-amber-400", Icon: Crown, desc: "Full control of workspace and billing" },
  admin: { label: "Admin", color: "bg-violet-500/10 text-violet-400", Icon: Shield, desc: "Manage members and workspace settings" },
  editor: { label: "Editor", color: "bg-blue-500/10 text-blue-400", Icon: Edit, desc: "Create, edit, and export content" },
  viewer: { label: "Viewer", color: "bg-muted/40 text-muted-foreground", Icon: Eye, desc: "View-only access to workspace content" },
};

const INITIAL_MEMBERS: Member[] = [
  {
    id: "m1",
    displayName: "You",
    email: "you@example.com",
    role: "owner",
    joinedAt: "Oct 2024",
    lastActive: "Now",
    avatar: "Y",
  },
];

const ACTIVITY_LOG = [
  { id: "a1", user: "You", action: "Generated 10 title variants", time: "10m ago", type: "ai" },
  { id: "a2", user: "You", action: "Ran channel audit", time: "2h ago", type: "audit" },
  { id: "a3", user: "You", action: "Added competitor: TechWithTim", time: "1d ago", type: "competitor" },
  { id: "a4", user: "You", action: "Saved 3 keywords to project", time: "2d ago", type: "keyword" },
  { id: "a5", user: "You", action: "Created project: Q1 2025 Strategy", time: "3d ago", type: "project" },
];

export function WorkspaceClient() {
  const [members] = useState<Member[]>(INITIAL_MEMBERS);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("editor");

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviteEmail("");
    setInviteOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Team & Workspace</h1>
          <p className="text-sm text-muted-foreground">Manage your workspace members and activity</p>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => setInviteOpen(true)}
          disabled
        >
          <UserPlus className="h-4 w-4" />
          Invite member
          <Badge className="ml-1 bg-primary/15 text-primary text-[10px]">Pro</Badge>
        </Button>
      </div>

      {/* Workspace info */}
      <div className="rounded-xl border border-border/60 bg-card/50 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-600 text-sm font-bold text-white">
                W
              </div>
              <div>
                <p className="font-semibold text-foreground">My Workspace</p>
                <p className="text-xs text-muted-foreground">Personal workspace · Free plan</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Members", value: members.length },
              { label: "Projects", value: 3 },
              { label: "AI gens", value: 142 },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue="members">
        <TabsList className="h-auto gap-1 bg-card/50 p-1">
          <TabsTrigger value="members" className="gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5" />
            Members
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-1.5 text-xs">
            <Shield className="h-3.5 w-3.5" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-1.5 text-xs">
            <Activity className="h-3.5 w-3.5" />
            Activity Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-4 space-y-2">
          {members.map((member) => {
            const roleCfg = ROLE_CONFIG[member.role];
            const RoleIcon = roleCfg.Icon;
            return (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600/30 to-cyan-600/30 text-sm font-bold text-foreground">
                  {member.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{member.displayName}</p>
                    <Badge className={cn("gap-1 text-[10px]", roleCfg.color)}>
                      <RoleIcon className="h-2.5 w-2.5" />
                      {roleCfg.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-xs text-muted-foreground">Last active</p>
                  <p className="text-xs font-medium text-foreground">{member.lastActive}</p>
                </div>
                {member.role !== "owner" && (
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            );
          })}

          <div className="rounded-xl border border-dashed border-border/60 p-6 text-center">
            <Users className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
            <p className="font-medium text-foreground">Invite your team</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Upgrade to Pro to invite team members and collaborate on content.
            </p>
            <Button size="sm" className="mt-3">
              Upgrade to Pro
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="roles" className="mt-4 space-y-3">
          {(Object.entries(ROLE_CONFIG) as [Role, typeof ROLE_CONFIG[Role]][]).map(([role, cfg]) => {
            const Icon = cfg.Icon;
            return (
              <div key={role} className="rounded-xl border border-border/60 bg-card/50 p-4">
                <div className="flex items-start gap-3">
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", cfg.color.replace("text-", "bg-").replace("/10", "/10"))}>
                    <Icon className={cn("h-4 w-4", cfg.color.split(" ")[1])} />
                  </div>
                  <div>
                    <Badge className={cn("mb-1 text-[10px]", cfg.color)}>{cfg.label}</Badge>
                    <p className="text-sm text-muted-foreground">{cfg.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <div className="rounded-xl border border-border/60 bg-card/50 p-5">
            <h3 className="mb-4 font-semibold text-foreground">Recent workspace activity</h3>
            <div className="space-y-3">
              {ACTIVITY_LOG.map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted/30">
                    <Activity className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{log.user}</span>{" "}
                      <span className="text-muted-foreground">{log.action}</span>
                    </p>
                    <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground/60">
                      <Clock className="h-3 w-3" />
                      {log.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite team member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email address</label>
              <Input
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Role</label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
              <Button type="submit">Send invite</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
