import { motion, type MotionProps } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  motionProps?: MotionProps;
}

const PrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      isLoading = false,
      loadingText = "Loading...",
      icon,
      iconPosition = "right",
      variant = "primary",
      size = "md",
      fullWidth = false,
      className = "",
      disabled,
      motionProps,
      ...props
    },
    ref,
  ) => {
    // Base classes
    const baseClasses =
      " btn-gradient w-full rounded-lg mt-7 py-2.5 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

    // Size classes
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2.5 text-base",
      lg: "px-6 py-3 text-lg",
    };

    // Variant classes
    const variantClasses = {
      primary:
        "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95",
      outline:
        "border border-border bg-transparent hover:bg-accent/10 active:scale-95",
      ghost: "bg-transparent hover:bg-accent/10 active:scale-95",
      gradient: "btn-gradient", // Your custom gradient class
    };

    // Width class
    const widthClass = fullWidth ? "w-full" : "";

    // Combine all classes
    const combinedClassName = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`;

    // Animation variants
    const motionVariants = {
      hover: { scale: 1.02 },
      tap: { scale: 0.98 },
    };

    const content = isLoading ? (
      <>
        <Loader2 className="size-4 animate-spin" />
        {loadingText}
      </>
    ) : (
      <>
        {icon && iconPosition === "left" && (
          <span className="inline-flex">{icon}</span>
        )}
        {children}
        {icon && iconPosition === "right" && (
          <span className="inline-flex">{icon}</span>
        )}
      </>
    );

    return (
      <motion.button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || isLoading}
        whileHover="hover"
        whileTap="tap"
        variants={motionVariants}
        {...motionProps}
        {...(props as any)}
      >
        {content}
      </motion.button>
    );
  },
);

PrimaryButton.displayName = "PrimaryButton";

export default PrimaryButton;
