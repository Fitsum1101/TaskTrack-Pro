import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface IProps {
  name: string;
  label: string;
  isRequired?: boolean;
}

const RHFSwitch = ({
  name,
  isRequired = true,
  label,
  ...other
}: IProps & React.ComponentProps<typeof Switch>) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-2 h-12 flex flex-col justify-end">
          <Label htmlFor={name} className="text-xs font-medium cursor-pointer">
            {label}
            {isRequired ? (
              <span className="text-red-500 align-middle">{" *"}</span>
            ) : (
              <span className="text-muted-foreground font-normal text-[10px]">
                {` (optional)`}
              </span>
            )}
          </Label>
          <div className="flex items-center space-x-2">
            <Switch
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              {...other}
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error.message}</p>}
        </div>
      )}
    />
  );
};

export default RHFSwitch;
