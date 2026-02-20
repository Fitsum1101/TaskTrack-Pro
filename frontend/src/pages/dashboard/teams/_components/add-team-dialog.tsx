import React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Team {
  id: string;
  name: string;
  description: string;
  members: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  }[];
  projects: number;
  createdAt: string;
}

interface AddTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTeam: (team: Team) => void;
}

export function AddTeamDialog({
  open,
  onOpenChange,
  onAddTeam,
}: AddTeamDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const newTeam: Team = {
        id: `team-${Date.now()}`,
        name,
        description,
        members: [],
        projects: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      onAddTeam(newTeam);
      setName("");
      setDescription("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create New Team</DialogTitle>
          <DialogDescription>
            Create a new team and start adding members
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Team Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Frontend Team"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg bg-secondary/50 border-border"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what this team does..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-lg bg-secondary/50 border-border"
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-gradient rounded-lg"
              disabled={!name.trim()}
            >
              Create Team
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
