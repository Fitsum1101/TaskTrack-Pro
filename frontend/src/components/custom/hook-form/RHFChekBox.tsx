import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface RHFCheckboxProps {
  name: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

const RHFCheckbox = ({
  name,
  label,
  description,
  disabled,
}: RHFCheckboxProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div
          className={`
            w-full select-none
            rounded-xl border bg-white
            px-4 py-4
            transition-all duration-200
            hover:border-primary/50 hover:bg-accent/40
            dark:bg-neutral-900 dark:border-neutral-800 dark:hover:bg-neutral-800
          `}
        >
          <Label
            htmlFor={name}
            className="
              flex items-start gap-3 cursor-pointer
              text-gray-900 dark:text-gray-100
            "
          >
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={(val) => field.onChange(val)}
              disabled={disabled}
              className="
                mt-1
                data-[state=checked]:bg-primary
                data-[state=checked]:border-primary
                data-[state=checked]:text-primary-foreground
                focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
              "
            />
            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-semibold leading-none">
                {label}
              </span>
              {description && (
                <span className="text-[13px] text-muted-foreground leading-normal">
                  {description}
                </span>
              )}
            </div>
          </Label>
        </div>
      )}
    />
  );
};

export default RHFCheckbox;
