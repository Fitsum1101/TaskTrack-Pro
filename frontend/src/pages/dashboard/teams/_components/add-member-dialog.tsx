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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  onAddMember: (name: string, role: string) => void;
}

export function AddMemberDialog({
  open,
  onOpenChange,
  onAddMember,
}: AddMemberDialogProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Developer");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddMember(name, role);
      setName("");
      setRole("Developer");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add Team Member</DialogTitle>
          <DialogDescription>
            Add a new member to your team with their role
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Member Name
            </Label>
            <Input
              id="name"
              placeholder="Enter member name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg bg-secondary/50 border-border"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-foreground">
              Role
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="rounded-lg bg-secondary/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Designer">Designer</SelectItem>
                <SelectItem value="DevOps">DevOps</SelectItem>
                <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                <SelectItem value="Product Manager">Product Manager</SelectItem>
              </SelectContent>
            </Select>
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
              Add Member
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
