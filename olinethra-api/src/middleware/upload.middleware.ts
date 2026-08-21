import multer from "multer"
import { AppError } from "./error.middleware.js"

const storage = multer.memoryStorage()

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "application/pdf",
    ]
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
      return
    }
    cb(new AppError(400, "INVALID_FILE", "Unsupported file type."))
  },
})
