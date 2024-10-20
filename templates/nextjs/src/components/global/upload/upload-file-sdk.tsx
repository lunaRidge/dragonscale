import { generateObjectKey } from "@/lib/helper";

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
  speed: number; // 单位：字节/秒
  remainingTime: number; // 单位：秒
}

interface UploadResult {
  objectKey: string;
}

const BucketName = "pm-app";

export async function uploadFileSDK(
  file: File,
  onProgress?: (progress: UploadProgress) => void,
  getAbort?: (abortController: AbortController) => void
): Promise<UploadResult> {
  //初始化取消控制器，并给到外面
  const abortController = new AbortController();
  getAbort?.(abortController);

  const objectKey = generateObjectKey(file);

  // 获取预签名 URL
  const presignedResponse = await fetch("/api/minio-presign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bucketName: BucketName,
      objectKey: objectKey,
    }),
  });

  if (!presignedResponse.ok) {
    throw new Error(
      `获取预签名 URL 失败: ${presignedResponse.status} ${presignedResponse.statusText}`
    );
  }
  // 成功得到预签名 URL, 用于上传
  const { presignedUrl } = await presignedResponse.json();

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let startTime: number;
    let lastLoaded = 0;
    let lastTime = Date.now();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const now = Date.now();
        const elapsedTime = (now - lastTime) / 1000; // 转换为秒
        const loadedSinceLastUpdate = event.loaded - lastLoaded;

        const speed = loadedSinceLastUpdate / elapsedTime;
        const remainingBytes = event.total - event.loaded;
        const remainingTime = speed > 0 ? remainingBytes / speed : 0;

        onProgress?.({
          loaded: event.loaded,
          total: event.total,
          percent: (event.loaded / event.total) * 100,
          speed: speed,
          remainingTime: remainingTime,
        });

        lastLoaded = event.loaded;
        lastTime = now;
      }
    };

    xhr.upload.onloadstart = () => {
      startTime = Date.now();
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ objectKey });
      } else {
        reject(new Error(`上传失败: ${xhr.status} ${xhr.statusText}`));
      }
    };

    xhr.onerror = (event) => {
      console.error("上传错误:", event);
      reject(new Error(`上传失败：${xhr.status} ${xhr.statusText}`));
    };

    xhr.onabort = () => {
      console.warn("上传被中止");
    };

    xhr.ontimeout = () => {
      reject(new Error("上传超时"));
    };

    //监听取消事件
    abortController.signal.addEventListener("abort", () => xhr.abort());

    xhr.open("PUT", presignedUrl, true);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.setRequestHeader("X-File-Name", encodeURIComponent(file.name));
    xhr.setRequestHeader("X-File-Size", file.size.toString());

    xhr.send(file);
  });
}
