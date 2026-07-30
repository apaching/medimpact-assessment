import crypto from "node:crypto";
import path from "node:path";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.BUCKET_REGION,
  endpoint: process.env.BUCKET_ENDPOINT,
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY as string,
  },
});

const PHOTO_URL_TTL_SECONDS = 60 * 60;

export async function uploadPhoto(file: Express.Multer.File): Promise<string> {
  const key = `contacts/${Date.now()}-${crypto.randomBytes(6).toString("hex")}${path.extname(file.originalname)}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );
  return key;
}

export async function getPhotoUrl(key: string | null | undefined): Promise<string | null> {
  if (!key) return null;
  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: process.env.BUCKET_NAME, Key: key }),
    { expiresIn: PHOTO_URL_TTL_SECONDS },
  );
}

export async function deletePhoto(key: string | null | undefined): Promise<void> {
  if (!key) return;
  await s3.send(new DeleteObjectCommand({ Bucket: process.env.BUCKET_NAME, Key: key }));
}
