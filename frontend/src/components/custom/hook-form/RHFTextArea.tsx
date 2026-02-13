import { useFormContext, Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface IProps {
  name: string;
  label: string;
  isRequired?: boolean;
  rows?: number;
}

export default function RHFTextArea({
  name,
  isRequired = true,
  label,
  rows = 3,
  ...other
}: IProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <div className="space-y-1">
            <Label className="text-xs font-medium mb-1 block ">
              {label}
              {isRequired ? (
                <span className="text-red-500 align-middle">{" *"}</span>
              ) : (
                <span className="text-[#929292] font-normal text-[10px]">{`(optional)`}</span>
              )}
            </Label>
            <Textarea
              id={name}
              {...field}
              rows={rows}
              className={`justify-between font-normal text-xs border-[0.84px] ${
                error ? "border-red-500" : "border-gray-600"
              } py-2 w-full rounded-lg ps-3 placeholder:font-light placeholder:text-xs focus-visible:outline-none focus-visible:ring-1  focus:ring-primary focus:border-ring`}
              {...other}
            />
            {error && <p className="text-red-500 text-xs">{error.message}</p>}
          </div>
        );
      }}
    />
  );
}
