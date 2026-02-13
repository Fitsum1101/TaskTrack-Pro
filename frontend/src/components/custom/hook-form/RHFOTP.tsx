import { useFormContext, Controller } from "react-hook-form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";

interface RHFOTPProps {
  name: string;
  label: string;
  maxLength?: number;
  isRequired?: boolean;
}

const RHFOTP = ({
  name,
  label,
  maxLength = 6,
  isRequired = true,
}: RHFOTPProps) => {
  const { control, setValue } = useFormContext();

  return (
    <div className="space-y-1 flex flex-col">
      {label && (
        <Label className="text-xs font-medium mb-1 block">
          {label}
          {isRequired ? (
            <span className="text-red-500 align-middle">*</span>
          ) : (
            <span className="text-gray-400 font-normal text-[10px]">
              (optional)
            </span>
          )}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div className="flex flex-col ">
            <InputOTP
              maxLength={maxLength}
              value={field.value || ""}
              onChange={(newOtp: string) => {
                field.onChange(newOtp);
                setValue(name, newOtp);
              }}
            >
              <InputOTPGroup className="w-full flex  justify-between gap-2">
                {Array.from({ length: maxLength }).map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className={`
                      w-14 h-14 sm:w-14 sm:h-14 text-sm sm:text-lg font-semibold rounded-lg
                      border
                      ${
                        error
                          ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-300 dark:border-gray-600 focus:border-purple-600 focus:ring-purple-200 focus:ring-0"
                      }
                      transition-colors duration-200
                    `}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {error && (
              <p className="text-red-500 text-xs italic mt-1">
                {error.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default RHFOTP;
