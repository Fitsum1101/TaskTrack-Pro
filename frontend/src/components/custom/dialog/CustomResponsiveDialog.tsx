import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type ResponsiveDialogProps = {
  // Content props
  children: React.ReactNode;
  title?: string;
  description?: string;

  // Control props
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  // Layout & styling props
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "custom";
  customSize?: string; // For custom size when size="custom"
  side?: "top" | "right" | "bottom" | "left"; // For mobile drawer position
  dialogContentClassName?: string;
  drawerContentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;

  // Feature props
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  closeButtonPosition?: "header" | "corner" | "both" | "none";
  preventClose?: boolean; // Prevent closing by clicking outside or escape

  // Accessibility
  ariaLabel?: string;
  ariaDescription?: string;
};

export function ResponsiveDialog({
  children,
  title,
  description,
  onOpenChange,
  open: controlledOpen,
  defaultOpen = false,
  footer,
  dialogContentClassName,
  drawerContentClassName,
  headerClassName,
  bodyClassName,
  footerClassName,
  size = "md",
  customSize,
  side = "bottom",
  showCloseButton = true,
  closeButtonPosition = "corner",
  preventClose = false,
  ariaLabel,
  ariaDescription,
}: ResponsiveDialogProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isDesktop = useMediaQuery("(min-width: 768px)"); // Fixed: using proper desktop breakpoint

  // Use controlled open if provided, otherwise use internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (preventClose && !newOpen) {
      return; // Prevent closing if preventClose is true
    }

    if (controlledOpen === undefined) {
      setInternalOpen(newOpen); // Only update internal state if not controlled
    }
    onOpenChange?.(newOpen); // Always call the provided onOpenChange
  };

  // Size mapping for desktop dialog
  const sizeClasses = {
    sm: "sm:max-w-[425px]",
    md: "sm:max-w-[600px]",
    lg: "sm:max-w-[800px]",
    xl: "sm:max-w-[1000px]",
    "2xl": "sm:max-w-[1200px]",
    full: "sm:max-w-[95vw]",
    custom: customSize || "sm:max-w-[600px]",
  };

  // Side mapping for mobile drawer
  const drawerSide =
    side === "bottom"
      ? "bottom"
      : side === "top"
      ? "top"
      : side === "left"
      ? "left"
      : "right";

  // Close button component
  const CloseButton = ({ className = "" }: { className?: string }) => (
    <DialogClose asChild>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          className
        )}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
    </DialogClose>
  );

  // Desktop Dialog Version
  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          className={cn(
            sizeClasses[size],
            "gap-0 max-h-[90vh] overflow-hidden [&>button]:hidden",
            dialogContentClassName
          )}
          onInteractOutside={(e) => preventClose && e.preventDefault()}
          onEscapeKeyDown={(e) => preventClose && e.preventDefault()}
          aria-label={ariaLabel}
          aria-describedby={ariaDescription ? "dialog-description" : undefined}
        >
          {/* Close button in corner */}
          {showCloseButton &&
            (closeButtonPosition === "corner" ||
              closeButtonPosition === "both") && (
              <CloseButton className="absolute right-4 top-4" />
            )}

          <DialogHeader
            className={cn("px-6 pt-6 pb-4 border-b", headerClassName)}
          >
            <div
              className={cn(
                "flex flex-col space-y-1.5 text-center sm:text-left",
                headerClassName
              )}
            >
              <div className="flex items-center justify-between">
                {title && (
                  <DialogTitle className="text-lg font-semibold leading-none tracking-tight">
                    {title}
                  </DialogTitle>
                )}
                {showCloseButton &&
                  (closeButtonPosition === "header" ||
                    closeButtonPosition === "both") && (
                    <CloseButton className="sm:hidden" />
                  )}
              </div>
              {description && (
                <DialogDescription className="text-sm text-muted-foreground">
                  {description}
                </DialogDescription>
              )}
            </div>
          </DialogHeader>

          <div className={cn("flex-1 overflow-auto px-6 py-4", bodyClassName)}>
            {children}
          </div>

          {footer && (
            <div
              className={cn("px-6 py-4 border-t bg-muted/10", footerClassName)}
            >
              {footer}
            </div>
          )}

          {/* Hidden description for accessibility */}
          {ariaDescription && (
            <div id="dialog-description" className="sr-only">
              {ariaDescription}
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  // Mobile Drawer Version
  return (
    <Drawer
      open={isOpen}
      onOpenChange={handleOpenChange}
      direction={drawerSide}
    >
      <DrawerContent
        className={cn(
          "mx-auto w-full max-w-[100vw]",
          drawerSide === "bottom" && "rounded-t-xl",
          drawerSide === "top" && "rounded-b-xl",
          "[&_.bg-muted]:hidden", // This hides the drag handle
          drawerContentClassName
        )}
      >
        {/* Handle for drag indication */}
        {drawerSide === "bottom" && (
          <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-muted" />
        )}
        {drawerSide === "top" && (
          <div className="mx-auto mb-2 h-1 w-12 rounded-full bg-muted" />
        )}

        <DrawerHeader className={cn("text-left pb-4", headerClassName)}>
          <div className="flex items-center justify-between">
            {title && (
              <DrawerTitle className="text-base font-semibold">
                {title}
              </DrawerTitle>
            )}
            {showCloseButton && (
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </DrawerClose>
            )}
          </div>
          {description && (
            <DrawerDescription className="text-sm text-muted-foreground">
              {description}
            </DrawerDescription>
          )}
        </DrawerHeader>

        <div
          className={cn("px-4 pb-4 overflow-auto max-h-[70vh]", bodyClassName)}
        >
          {children}
        </div>

        {footer && (
          <DrawerFooter
            className={cn("pt-4 border-t bg-muted/20", footerClassName)}
          >
            {footer}
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
