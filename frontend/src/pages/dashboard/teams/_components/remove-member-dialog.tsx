import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";

interface RemoveMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberName: string;
  onConfirm: () => void;
}

export function RemoveMemberDialog({
  open,
  onOpenChange,
  memberName,
  onConfirm,
}: RemoveMemberDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-destructive/10 p-2">
              <AlertCircle className="size-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Remove {memberName}?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. The member will be removed from
                the team.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="destructive"
            className="rounded-lg"
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
