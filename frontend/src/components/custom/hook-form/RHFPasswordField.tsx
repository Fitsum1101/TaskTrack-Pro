import { useFormContext, Controller } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface IProps {
  name: string;
  label: string;
  isRequired?: boolean;
}

export default function RHFPasswordField({
  name,
  label,
  isRequired = true,
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
          <Label htmlFor={name}>{label}</Label>

          <div className="relative">
            {/* Left Lock Icon */}
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

            <Input
              id={name}
              {...field}
              onChange={(e) => {
                field.onChange(e.target.value);
                clearErrors(name);
              }}
              type={showPassword ? "text" : "password"}
              className={`pl-11 pr-11 glass border-white/20 bg-card/40 ${
                error ? "border-red-500" : ""
              }`}
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
