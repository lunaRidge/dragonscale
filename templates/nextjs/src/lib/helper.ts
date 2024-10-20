import { v4 as uuidv4 } from "uuid";

export const formatSpeed = (speed: number) => {
    if (speed < 1024) return `${speed.toFixed(2)} B/s`;
    if (speed < 1024 * 1024) return `${(speed / 1024).toFixed(2)} KB/s`;
    return `${(speed / (1024 * 1024)).toFixed(2)} MB/s`;
  };
  
  export const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(0)}秒`;
    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}分钟${remainingSeconds}秒`;
    }
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    return `${hours}小时${remainingMinutes}分钟`;
  };
  
  export const formatSize = (size: number) => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let index = 0;
    while (size >= 1024 && index < units.length - 1) {
      size /= 1024;
      index++;
    }
    return `${size.toFixed(2)} ${units[index]}`;
  };
  
  export const generateObjectKey = (file: File) => {
    const timestamp = new Date();
    const year = timestamp.getFullYear();
    const month = String(timestamp.getMonth() + 1).padStart(2, "0");
    const day = String(timestamp.getDate()).padStart(2, "0");
    const uuid = uuidv4();
    const fileExtension = file.name.split(".").pop();
    const objectKey = `${year}/${month}/${day}/${uuid}.${fileExtension}`;
  
    return objectKey;
  };
  