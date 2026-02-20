import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const availableProjects = [
  { id: "p1", name: "Dashboard Redesign" },
  { id: "p2", name: "Mobile App" },
  { id: "p3", name: "Component Library" },
  { id: "p4", name: "API v2" },
  { id: "p5", name: "Database Migration" },
  { id: "p6", name: "Design Tokens v2" },
  { id: "p7", name: "Icon Library" },
  { id: "p8", name: "Test Automation" },
  { id: "p9", name: "Performance Testing" },
  { id: "p10", name: "Security Audit" },
];

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignedProjects: string[];
  onAdd: (projectId: string) => void;
}

export function AddProjectDialog({
  open,
  onOpenChange,
  assignedProjects,
  onAdd,
}: AddProjectDialogProps) {
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const unassignedProjects = availableProjects.filter(
    (p) => !assignedProjects.includes(p.id),
  );

  const handleAdd = () => {
    if (selectedProjectId) {
      onAdd(selectedProjectId);
      setSelectedProjectId("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Assign Project</DialogTitle>
          <DialogDescription>
            Select a project to assign to this team
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="project" className="text-foreground">
              Select Project
            </Label>
            <Select
              value={selectedProjectId}
              onValueChange={setSelectedProjectId}
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Choose a project" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                {unassignedProjects.length > 0 ? (
                  unassignedProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    All projects are assigned
                  </div>
                )}
              </SelectContent>
            </Select>
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
            onClick={handleAdd}
            className="btn-gradient rounded-lg"
            disabled={!selectedProjectId || unassignedProjects.length === 0}
          >
            Assign Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
