"use client";

import { useEffect, useState } from "react";
import type { CalItem } from "./calendar-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TYPE_COLORS = {
  video: "#8b5cf6",
  short: "#06b6d4",
  live: "#ef4444",
  idea: "#f59e0b",
};

export function CalendarAddDialog({
  open,
  defaultDate,
  onClose,
  onAdd,
}: {
  open: boolean;
  defaultDate?: string;
  onClose: () => void;
  onAdd: (item: Omit<CalItem, "id">) => void;
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<CalItem["type"]>("video");
  const [status, setStatus] = useState<CalItem["status"]>("idea");
  const [date, setDate] = useState(defaultDate ?? new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (!open) return;
    setDate(defaultDate ?? new Date().toISOString().split("T")[0]);
  }, [defaultDate, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      type,
      status,
      date,
      color: TYPE_COLORS[type],
    });
    setTitle("");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add content</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="cal-title">Title</Label>
            <Input
              id="cal-title"
              placeholder="Video title or idea..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as CalItem["type"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Long-form video</SelectItem>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="live">Livestream</SelectItem>
                  <SelectItem value="idea">Idea</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as CalItem["status"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Idea</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cal-date">Date</Label>
            <Input
              id="cal-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Add to calendar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
