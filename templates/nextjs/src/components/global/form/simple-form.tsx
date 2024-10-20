import { Form } from "@/components/ui/form";
import { FormProvider } from "@/providers/form-provider";
import { UseFormReturn, FieldValues } from "react-hook-form";

interface FormWrapperProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
  children: React.ReactNode;
}

export function SimpleForm<T extends FieldValues>({
  form,
  onSubmit,
  children,
}: FormWrapperProps<T>) {
  return (
    <FormProvider value={form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {children}
        </form>
      </Form>
    </FormProvider>
  );
}
