import type { ReactNode, FormHTMLAttributes } from "react";
import type { UseFormReturn, FieldValues } from "react-hook-form";

import { FormProvider as RHFProvider } from "react-hook-form";

type Props<
  TFieldValues extends FieldValues,
  TContext extends object = object,
  TTransformedValues extends FieldValues | undefined = undefined,
> = {
  children: ReactNode;
  methods: UseFormReturn<TFieldValues, TContext, TTransformedValues>;
  onSubmit?: FormHTMLAttributes<HTMLFormElement>["onSubmit"];
};

export default function FormProvider<
  TFieldValues extends FieldValues,
  TContext extends object = object,
  TTransformedValues extends FieldValues | undefined = undefined,
>({
  children,
  onSubmit,
  methods,
}: Props<TFieldValues, TContext, TTransformedValues>) {
  return (
    <RHFProvider {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </RHFProvider>
  );
}
