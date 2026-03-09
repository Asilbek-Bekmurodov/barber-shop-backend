import { S3Client } from "@aws-sdk/client-s3"

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_ENDPOINT,
  R2_BUCKET,
  R2_PUBLIC_BASE_URL,
} = process.env

const endpoint =
  R2_ENDPOINT ||
  (R2_ACCOUNT_ID
    ? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
    : undefined)

const r2 = new S3Client({
  region: "auto",
  endpoint,
  credentials:
    R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY
      ? {
          accessKeyId: R2_ACCESS_KEY_ID,
          secretAccessKey: R2_SECRET_ACCESS_KEY,
        }
      : undefined,
})

export const r2Bucket = R2_BUCKET
export const r2PublicBaseUrl = R2_PUBLIC_BASE_URL

export default r2
