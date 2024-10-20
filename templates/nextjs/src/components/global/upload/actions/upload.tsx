"use server";
import { getMinioClient } from "@/lib/minio";

const minioClient = getMinioClient();
const bucketName = "mono";

// 生成预签名URL的函数保持不变
export async function getPresignedUrl(
  objectKey: string,
  expirationTime: number = 60 * 60 * 3 // 3小时
) {
  try {
    const url = await minioClient.presignedGetObject(
      bucketName,
      objectKey,
      expirationTime
    );
    return url;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error("Error generating presigned URL");
  }
}

export async function setObjectTagging(
  objectKey: string,
  tags: Record<string, string>
) {
  try {
    await (minioClient.setObjectTagging as any)(bucketName, objectKey, tags);
  } catch (error) {
    console.error("Error setting object tagging:", error);
    throw new Error("Error setting object tagging");
  }
}
