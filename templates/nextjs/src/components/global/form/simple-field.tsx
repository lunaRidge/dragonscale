import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/global/upload/file-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormContext } from "@/providers/form-provider";
import { Switch } from "../../ui/switch";
import { ImageUpload } from "../upload/image-upload";
import ProInput from "./pro-input";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

export interface SimpleFormFieldProps {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  readOnly?: boolean;
  type: "text" | "file" | "image" | "checkbox" | "switch";
}

export function SimpleField({
  name,
  label,
  description,
  placeholder,
  readOnly,
  type = "text",
}: SimpleFormFieldProps) {
  const form = useFormContext();

  const renderControl = (field: ControllerRenderProps<FieldValues, string>) => {
    switch (type) {
      case "text":
        return (
          <ProInput {...field} placeholder={placeholder} readOnly={readOnly} />
        );
      case "file":
        return <FileUpload onChange={field.onChange} value={field.value} />;
      case "image":
        return (
          <ImageUpload
            onChange={field.onChange}
            value={field.value}
            sizeLimit={5242880} // 5MB
          />
        );
      case "checkbox":
        return (
          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
        );
      case "switch":
        return (
          <Switch checked={field.value} onCheckedChange={field.onChange} />
        );
      default:
        return <Input {...field} placeholder={placeholder} />;
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        if (type === "switch") {
          return (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>{label}</FormLabel>
                <FormControl>{renderControl(field)}</FormControl>
              </div>
              {description && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </FormItem>
          );
        }
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>{renderControl(field)}</FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
