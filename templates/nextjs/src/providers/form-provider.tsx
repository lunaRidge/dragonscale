import React, { createContext, useContext } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";

// 创建一个泛型 Context
const FormContext = createContext<UseFormReturn<FieldValues> | null>(null);

// FormProvider 组件
export function FormProvider<TFieldValues extends FieldValues>({
  children,
  value,
}: {
  children: React.ReactNode;
  value: UseFormReturn<TFieldValues>;
}) {
  return (
    <FormContext.Provider value={value as UseFormReturn<FieldValues>}>
      {children}
    </FormContext.Provider>
  );
}

// 自定义 hook 用于访问表单上下文
export function useFormContext<TFieldValues extends FieldValues>() {
  const context = useContext(FormContext);
  if (context === null) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context as UseFormReturn<TFieldValues>;
}
