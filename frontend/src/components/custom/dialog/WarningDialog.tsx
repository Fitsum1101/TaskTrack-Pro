import { AlertTriangle, Loader, Info, Ban, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface WarningDialogProps {
  isLoading?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  severity?: "warning" | "danger" | "info" | "success";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  closeOnConfirm?: boolean;
  disableConfirm?: boolean;
  disableCancel?: boolean;
}

export function WarningDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Continue",
  cancelText = "Cancel",
  onConfirm,
  isLoading = false,
  severity = "warning",
  size = "md",
  showIcon = true,
  closeOnConfirm = true,
  disableConfirm = false,
  disableCancel = false,
}: WarningDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleConfirm = () => {
    onConfirm();
    if (closeOnConfirm) {
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  // Theme-aligned color mapping using Tailwind CSS semantic colors
  const severityConfig = {
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-amber-100 dark:bg-amber-950/20",
      iconColor: "text-amber-600 dark:text-amber-500",
      borderColor: "border-amber-200 dark:border-amber-800",
      button: "bg-amber-600 hover:bg-amber-700 text-white",
      accent: "text-amber-600 dark:text-amber-500",
    },
    danger: {
      icon: Ban,
      iconBg: "bg-red-100 dark:bg-red-950/20",
      iconColor: "text-red-600 dark:text-red-500",
      borderColor: "border-red-200 dark:border-red-800",
      button: "bg-red-600 hover:bg-red-700 text-white",
      accent: "text-red-600 dark:text-red-500",
    },
    info: {
      icon: Info,
      iconBg: "bg-blue-100 dark:bg-blue-950/20",
      iconColor: "text-blue-600 dark:text-blue-500",
      borderColor: "border-blue-200 dark:border-blue-800",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      accent: "text-blue-600 dark:text-blue-500",
    },
    success: {
      icon: CheckCircle,
      iconBg: "bg-green-100 dark:bg-green-950/20",
      iconColor: "text-green-600 dark:text-green-500",
      borderColor: "border-green-200 dark:border-green-800",
      button: "bg-green-600 hover:bg-green-700 text-white",
      accent: "text-green-600 dark:text-green-500",
    },
  };

  const sizeConfig = {
    sm: "sm:max-w-[425px]",
    md: "sm:max-w-[500px]",
    lg: "sm:max-w-[600px]",
  };

  const config = severityConfig[severity];
  const IconComponent = config.icon;

  // Desktop Dialog Version
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={cn("sm:max-w-[500px]", sizeConfig[size])}>
          <DialogHeader>
            <DialogTitle
              className={cn("text-lg flex items-center gap-3", config.accent)}
            >
              {showIcon && (
                <div className={cn("p-2 rounded-full", config.iconBg)}>
                  <IconComponent className={cn("h-5 w-5", config.iconColor)} />
                </div>
              )}
              {title}
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              {description}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading || disableCancel}
                className="border-border hover:text-primary hover:bg-muted/50"
              >
                {cancelText}
              </Button>
              <Button
                disabled={isLoading || disableConfirm}
                onClick={handleConfirm}
                className={cn(
                  "transition-all duration-200",
                  config.button,
                  isLoading && "opacity-70",
                )}
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  confirmText
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Mobile Drawer Version
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className={cn("flex items-center gap-3", config.accent)}>
            {showIcon && (
              <div className={cn("p-2 rounded-full", config.iconBg)}>
                <IconComponent className={cn("h-5 w-5", config.iconColor)} />
              </div>
            )}
            {title}
          </DrawerTitle>
          <DrawerDescription className="text-base mt-2">
            {description}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-3 mb-10">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading || disableCancel}
              className="sm:mt-0 border-border hover:text-primary hover:bg-muted/50 "
            >
              {cancelText}
            </Button>
            <Button
              disabled={isLoading || disableConfirm}
              onClick={handleConfirm}
              className={cn(
                "transition-all duration-200",
                config.button,
                isLoading && "opacity-70",
              )}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
