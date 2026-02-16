import { useFormContext, Controller } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface IProps {
  name: string;
  label: string;
  isRequired?: boolean;
  showIcon?: boolean;
}

export default function RHFPasswordField({
  name,
  label,
  isRequired = true,
  className,
  showIcon = false,
  ...other
}: IProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const { control, clearErrors } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-2">
          <Label htmlFor={name}>
            {label}{" "}
            {isRequired ? (
              <span className="text-red-500">*</span>
            ) : (
              <span className="text-gray-400 font-normal text-[10px]">
                (optional)
              </span>
            )}
          </Label>

          <div className="relative">
            {/* Left Lock Icon */}
            {showIcon && (
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            )}

            <Input
              id={name}
              {...field}
              onChange={(e) => {
                field.onChange(e.target.value);
                clearErrors(name);
              }}
              type={showPassword ? "text" : "password"}
              className={`w-full h-10 rounded-md border py-2 
              } text-[16px] font-normal placeholder:text-xs placeholder:font-light
                focus:ring-0 focus:ring-offset-0 focus-visible:ring-[0.3px] focus-visible:outline-none
                ${
                  error
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }
                ${className}`}
              {...other}
            />

            {/* Toggle Icon */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}
