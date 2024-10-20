import { BaseUpload, BaseUploadProps } from "./base-upload";
import Image from "next/image";

interface ImageUploadProps
  extends Omit<BaseUploadProps, "accept" | "validateFile" | "renderPreview"> {
  sizeLimit?: number; // 单位：字节
}

export const ImageUpload = ({ sizeLimit, ...props }: ImageUploadProps) => {
  const validateFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return {
        isValid: false,
        message: "文件格式错误，请上传图片文件",
      };
    }
    if (sizeLimit && file.size > sizeLimit) {
      return {
        isValid: false,
        message: `文件大小超过限制，最大允许 ${sizeLimit / 1024 / 1024} MB`,
      };
    }

    return {
      isValid: true,
      message: "",
    };
  };

  const renderPreview = (previewUrl: string) => (
    <div className="mt-4">
      <Image
        src={previewUrl}
        alt="预览"
        width={80}
        height={80}
        style={{ width: "auto", height: "auto" }}
        className="object-cover"
      />
    </div>
  );

  return (
    <BaseUpload
      {...props}
      accept="image/*"
      validateFile={validateFile}
      renderPreview={renderPreview}
    />
  );
};
