import { useState, useLayoutEffect } from "react";
import { getPresignedUrl, setObjectTagging } from "./actions/upload";
import ProInput from "../form/pro-input";
import { uploadFileSDK, UploadProgress } from "./upload-file-sdk";
import { formatSize, formatSpeed, formatTime } from "@/lib/helper";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export interface BaseUploadProps {
  onChange: (objectKey: string) => void;
  value: string;
  accept?: string;
  validateFile?: (file: File) => { isValid: boolean; message: string };
  renderPreview?: (previewUrl: string) => React.ReactNode;
}

interface UploadStatus extends UploadProgress {
  isUploading: boolean;
}

export const BaseUpload = ({
  onChange,
  value,
  accept,
  validateFile,
  renderPreview,
}: BaseUploadProps) => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    isUploading: false,
    loaded: 0,
    total: 0,
    percent: 0,
    speed: 0,
    remainingTime: 0,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  useLayoutEffect(() => {
    if (value) {
      getPresignedUrl(value).then(setPreviewUrl);
    }
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validateFile) {
        const result = validateFile(file);
        if (!result.isValid) {
          setError(result.message);
          return;
        }
      }
      setPreviewUrl(null);
      setError(null);
      setUploadStatus({
        isUploading: true,
        loaded: 0,
        total: file.size,
        percent: 0,
        speed: 0,
        remainingTime: 0,
      });
      try {
        const { objectKey } = await uploadFileSDK(
          file,
          (progress) => {
            setUploadStatus({
              isUploading: true,
              ...progress,
            });
          },
          (abortController) => {
            setAbortController(abortController);
          }
        );

        await setObjectTagging(objectKey, { temp: "true" });

        //成功上传，把objectKey给到外面
        onChange(objectKey);
        const url = await getPresignedUrl(objectKey);
        setPreviewUrl(url);
        setUploadStatus((prev) => ({ ...prev, isUploading: false }));
      } catch (error) {
        console.error("上传文件时出错:", error);
        setError("上传文件失败");
        setUploadStatus((prev) => ({ ...prev, isUploading: false }));
      }
    }
  };

  const handleClear = () => {
    if (abortController) {
      abortController.abort();
    }
    setPreviewUrl(null);
    setError(null);
    setUploadStatus((prev) => ({ ...prev, isUploading: false }));
  };

  return (
    <div>
      <ProInput
        type="file"
        onChange={handleFileChange}
        accept={accept}
        onClear={handleClear}
      />
      {uploadStatus.isUploading && (
        <>
          <div className="flex flex-col gap-2 w-full mt-2">
            <Progress
              value={Number(uploadStatus.percent.toFixed(2))}
              className="w-full h-3"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <div className="flex flex-col gap-2">
                <p>上传进度: {uploadStatus.percent.toFixed(2)}%</p>
                <p>已上传: {formatSize(uploadStatus.loaded)}</p>
                <p>总大小: {formatSize(uploadStatus.total)}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p>上传速度: {formatSpeed(uploadStatus.speed)}</p>
                <p>
                  剩余时间: {formatTime(Math.round(uploadStatus.remainingTime))}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleClear} size="sm">
              取消上传
            </Button>
          </div>
        </>
      )}

      {error && <p className="text-red-500">{error}</p>}
      {previewUrl && renderPreview && renderPreview(previewUrl)}
    </div>
  );
};
