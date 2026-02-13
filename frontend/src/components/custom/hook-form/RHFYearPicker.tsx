import { useFormContext, Controller } from "react-hook-form";
import { Calendar } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface RHFYearPickerProps {
  name: string;
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  startYear?: number;
  endYear?: number;
}

const RHFYearPicker = ({
  name,
  label,
  placeholder = "Select Year",
  isRequired = true,
  startYear = 2000,
  endYear = new Date().getFullYear() + 1,
}: RHFYearPickerProps) => {
  const { control, clearErrors } = useFormContext();
  const [open, setOpen] = useState(false);

  const years = useMemo(() => {
    const y: number[] = [];
    for (let i = endYear; i >= startYear; i--) y.push(i);
    return y;
  }, [startYear, endYear]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-2">
          {/* ---------------- Label ---------------- */}
          <Label className="text-sm font-medium mb-1 block">
            {label}{" "}
            {isRequired ? (
              <span className="text-red-500 align-middle">*</span>
            ) : (
              <span className="text-gray-400 font-normal text-[10px]">
                (optional)
              </span>
            )}
          </Label>

          {/* ---------------- Trigger ---------------- */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "bg-white h-10 w-full justify-between px-3 text-left font-normal",
                  error ? "border-red-500" : "border-gray-300",
                  !field.value && "text-muted-foreground",
                  " focus:ring-primary focus:border-ring",
                )}
              >
                {field.value || placeholder}
                <Calendar className="h-4 w-4 opacity-60 hover:text-ring" />
              </Button>
            </PopoverTrigger>

            {/* ---------------- List ---------------- */}
            <PopoverContent
              className="w-full max-h-64 overflow-y-auto p-2"
              align="start"
              side="bottom"
              sideOffset={4}
            >
              <div className="grid grid-cols-3 gap-2 p-1">
                {years.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => {
                      field.onChange(String(year));
                      clearErrors(name);
                      setOpen(false);
                    }}
                    className={cn(
                      "py-2 px-2 rounded-md text-sm border text-center hover:bg-primary transition",
                      field.value == year.toString()
                        ? "font-semibold bg-primary text-white"
                        : "bg-white border-gray-300",
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* ---------------- Error ---------------- */}
          {error && (
            <p className="text-red-500 text-xs mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};

export default RHFYearPicker;
