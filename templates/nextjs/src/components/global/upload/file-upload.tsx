import { BaseUpload, BaseUploadProps } from "./base-upload";

interface UploadProps
  extends Omit<BaseUploadProps, "accept" | "validateFile" | "renderPreview"> {
  sizeLimit?: number; // 单位：字节
}

const SuccessIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" fill="#4CAF50" />
    <path
      d="M8 12.5L11 15.5L16 9.5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FileUpload = ({ sizeLimit, ...props }: UploadProps) => {
  const validateFile = (file: File) => {
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

  const renderPreview = () => (
    <div className="mt-1 flex items-center gap-2">
      <SuccessIcon />
      <p className="text-sm">上传成功</p>
    </div>
  );

  return (
    <BaseUpload
      {...props}
      accept="*"
      validateFile={validateFile}
      renderPreview={renderPreview}
    />
  );
};
