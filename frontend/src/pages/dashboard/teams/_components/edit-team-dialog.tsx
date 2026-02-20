import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Team {
  id: string;
  name: string;
  description: string;
}

interface EditTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team;
  onSave: (name: string, description: string) => void;
}

export function EditTeamDialog({
  open,
  onOpenChange,
  team,
  onSave,
}: EditTeamDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      setName(team.name);
      setDescription(team.description);
    }
  }, [open, team]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name, description);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit Team Information</DialogTitle>
          <DialogDescription>
            Update your team's name and description
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Team Name
            </Label>
            <Input
              id="name"
              placeholder="Enter team name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description
            </Label>
            <Input
              id="description"
              placeholder="Enter team description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-lg"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="btn-gradient rounded-lg"
            disabled={!name.trim()}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
