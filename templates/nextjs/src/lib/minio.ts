import * as Minio from "minio";
let minioClientInstance: Minio.Client | null = null;

// 获取或创建 MinIO 客户端实例
export const getMinioClient = (): Minio.Client => {
  if (!minioClientInstance) {
    minioClientInstance = new Minio.Client({
      endPoint: process.env.NEXT_PUBLIC_MINIO_ENDPOINT!,
      port: parseInt(process.env.NEXT_PUBLIC_MINIO_PORT!),
      useSSL: process.env.NEXT_PUBLIC_MINIO_USE_SSL === "true",
      accessKey: process.env.MINIO_ACCESS_KEY!,
      secretKey: process.env.MINIO_SECRET_KEY!,
    });
  }
  return minioClientInstance;
};


