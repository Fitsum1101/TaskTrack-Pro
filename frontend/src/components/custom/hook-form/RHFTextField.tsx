import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import { Mail, User, Phone, Globe, Hash } from "lucide-react";

interface IProps {
  name: string;
  label: string;
  isRequired?: boolean;
  leftIcon?: "mail" | "user" | "phone" | "globe" | "hash";
}

const iconMap = {
  mail: Mail,
  user: User,
  phone: Phone,
  globe: Globe,
  hash: Hash,
};

export default function RHFTextField({
  name,
  label,
  isRequired = true,
  leftIcon,
  type = "text",
  className = "",
  ...other
}: IProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const { control, clearErrors } = useFormContext();
  const Icon = leftIcon ? iconMap[leftIcon] : null;

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
            {/* Left Icon */}
            {Icon && (
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            )}

            <Input
              id={name}
              type={type}
              {...field}
              onChange={(e) => {
                const value =
                  type === "number"
                    ? e.target.value
                      ? parseFloat(e.target.value)
                      : undefined
                    : e.target.value;

                field.onChange(value);
                clearErrors(name);
              }}
              className={`w-full h-10 rounded-md border py-2 ${
                Icon ? "ps-11" : "ps-3"
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
          </div>

          {error && (
            <p className="text-red-500 text-xs mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}
