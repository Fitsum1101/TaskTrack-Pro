import React from "react";

import { useState, useEffect } from "react";
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

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName: string;
  initialRole: string;
  onSave: (name: string, role: string) => void;
}

export function EditMemberDialog({
  open,
  onOpenChange,
  initialName,
  initialRole,
  onSave,
}: EditMemberDialogProps) {
  const [name, setName] = useState(initialName);
  const [role, setRole] = useState(initialRole);

  useEffect(() => {
    setName(initialName);
    setRole(initialRole);
  }, [initialName, initialRole, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name, role);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Edit Team Member
          </DialogTitle>
          <DialogDescription>
            Update the member's name and role
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Member Name
            </Label>
            <Input
              id="name"
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
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
