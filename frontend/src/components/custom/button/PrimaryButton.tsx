import React from "react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface PrimaryButtonProps {
  title?: string;
  onClick?: () => void;
  className?: string;
  type?: "submit" | "reset" | "button";
  isLoading?: boolean;
  isDisabled?: boolean;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "destructive"
    | "secondary"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  startIcon?: React.ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onClick,
  className,
  type = "button",
  isLoading = false,
  isDisabled = false,
  variant = "default",
  size = "default",
  startIcon,
}) => {
  const primaryGradient =
    "bg-[linear-gradient(135deg,var(--primary)_0%,var(--primary)_50%,oklch(0.65_0.17_130)_100%)]";

  const primaryHover =
    "hover:bg-[linear-gradient(135deg,var(--primary)_0%,oklch(0.72_0.19_125)_100%)]";

  const getVariantStyles = () => {
    if (variant === "default") {
      return cn(
        primaryGradient,
        primaryHover,
        "text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25",
        "transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.97]",
        "focus:ring-4 focus:ring-primary/40",
        "glow",
      );
    }

    if (variant === "outline") {
      return cn(
        "border border-primary text-primary",
        "hover:bg-primary hover:text-primary-foreground",
        "transition-all duration-300",
      );
    }

    return ""; // fallback for other variants
  };

  return (
    <Button
      disabled={isLoading || isDisabled}
      type={type}
      onClick={onClick}
      className={cn(
        buttonVariants({ variant, size }),
        "w-full h-11 rounded-md min-h-[44px] text-[0.9rem] flex items-center justify-center gap-2",
        getVariantStyles(),
        className,
      )}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader className="w-4 h-4 animate-spin border-2 border-white/30 border-t-white rounded-full" />
          {title ?? "Loading..."}
        </span>
      ) : (
        <>
          {startIcon && <span className="w-5 h-5">{startIcon}</span>}
          {title}
        </>
      )}
    </Button>
  );
};

export default PrimaryButton;
