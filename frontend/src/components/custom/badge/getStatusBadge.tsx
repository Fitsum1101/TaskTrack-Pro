import { Badge } from "@/components/ui/badge";
import { CheckIcon, AlertCircleIcon } from "lucide-react";

export const getStatusBadge = (isActive: boolean) => {
  if (isActive) {
    return (
      <Badge
        variant="secondary"
        className="flex items-center gap-1 bg-primary/90 text-white dark:bg-primary/80 text-xs"
      >
        <CheckIcon size={10} />
        Active
      </Badge>
    );
  }

  return (
    <Badge
      variant="destructive"
      className="flex items-center gap-1 bg-red-500 text-white dark:bg-red-600 text-xs"
    >
      <AlertCircleIcon size={10} />
      Disabled
    </Badge>
  );
};
