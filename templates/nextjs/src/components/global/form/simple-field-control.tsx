import React from "react";
import {
  Path,
  UseFormReturn,
  FieldValues,
  ControllerRenderProps,
} from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface SimpleFieldControlProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  description?: string;
  form: UseFormReturn<T>;
  control: (fieldProps: ControllerRenderProps<T, Path<T>>) => React.ReactNode;
}

export function SimpleFieldControl<T extends FieldValues>({
  name,
  label,
  description,
  form,
  control,
}: SimpleFieldControlProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>{control(field)}</FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
