import type { UploadApiResponse } from "cloudinary"
import { cloudinary, isCloudinaryConfigured } from "../config/cloudinary.js"
import { AppError } from "../middleware/error.middleware.js"

export async function uploadToCloudinary(
  buffer: Buffer,
  options: { folder?: string; resourceType?: "image" | "video" | "raw" }
): Promise<UploadApiResponse> {
  if (!isCloudinaryConfigured) {
    throw new AppError(503, "CLOUDINARY_NOT_CONFIGURED", "Cloudinary is not configured.")
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "olinethra",
        resource_type: options.resourceType || "auto",
      },
      (error, result) => {
        if (error || !result) reject(error || new Error("Upload failed"))
        else resolve(result)
      }
    )
    stream.end(buffer)
  })
}

export async function deleteFromCloudinary(publicId: string) {
  if (!isCloudinaryConfigured || !publicId) return
  await cloudinary.uploader.destroy(publicId)
}
