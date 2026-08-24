import type { Response } from "express"
import { Quote } from "../models/Quote.js"
import { uploadToCloudinary, deleteFromCloudinary } from "./cloudinary.service.js"

import { generateLegacyId } from "../utils/helpers.js"
import { logActivity } from "./activity.service.js"
import { AppError } from "../middleware/error.middleware.js"
import type { AuthUser } from "../types/index.js"

export interface CreateQuoteInput {
  title: string
  clientName?: string
  companyName?: string
  quotationNumber?: string
  quotationDate?: string
  projectName?: string
  notes?: string
  linkedInquiryId?: string
  linkedLeadId?: string
  tags?: string[]
}

export interface UpdateQuoteInput {
  title?: string
  clientName?: string
  companyName?: string
  quotationNumber?: string
  quotationDate?: string
  projectName?: string
  notes?: string
  linkedInquiryId?: string
  linkedLeadId?: string
  tags?: string[]
}

export async function createQuote(
  fileBuffer: Buffer,
  originalName: string,
  input: CreateQuoteInput,
  user: AuthUser
) {
  if (!input.title || !input.title.trim()) {
    throw new AppError(400, "MISSING_TITLE", "Quotation title is required.")
  }

  if (!fileBuffer || fileBuffer.length === 0) {
    throw new AppError(400, "MISSING_FILE", "PDF quotation file is required.")
  }

  if (fileBuffer.length > 10 * 1024 * 1024) {
    throw new AppError(400, "FILE_TOO_LARGE", "PDF file size must not exceed 10 MB.")
  }

  // 1. Upload to Cloudinary under folder "olinethra/quotes"
  let uploadResult
  try {
    uploadResult = await uploadToCloudinary(fileBuffer, {
      folder: "olinethra/quotes",
      resourceType: "raw",
    })
  } catch (err: any) {
    console.error("[QUOTE SERVICE] Cloudinary upload error:", err)
    throw new AppError(500, "UPLOAD_FAILED", "Failed to store PDF file on cloud storage.")
  }

  // 2. Save metadata to MongoDB with cleanup fallback
  try {
    const legacyId = generateLegacyId("quo")
    const parsedDate = input.quotationDate ? new Date(input.quotationDate) : undefined

    const quoteDoc = await Quote.create({
      legacyId,
      title: input.title.trim(),
      clientName: input.clientName?.trim() || undefined,
      companyName: input.companyName?.trim() || undefined,
      quotationNumber: input.quotationNumber?.trim() || undefined,
      quotationDate: parsedDate,
      projectName: input.projectName?.trim() || undefined,
      notes: input.notes?.trim() || undefined,
      file: {
        url: uploadResult.secure_url || uploadResult.url,
        publicId: uploadResult.public_id,
        originalName: originalName || "Quotation.pdf",
        format: uploadResult.format || "pdf",
        bytes: uploadResult.bytes || fileBuffer.length,
      },
      uploadedBy: user.name || user.email || "Admin",
      linkedInquiryId: input.linkedInquiryId,
      linkedLeadId: input.linkedLeadId,
      tags: input.tags || [],
    })

    await logActivity({
      user: user.name || user.email,
      action: "Uploaded Quotation PDF",
      entity: "quote",
      resourceId: legacyId,
      metadata: {
        title: quoteDoc.title,
        quotationNumber: quoteDoc.quotationNumber,
        clientName: quoteDoc.clientName,
      },
    })

    return quoteDoc
  } catch (dbErr: any) {
    console.error("[QUOTE SERVICE] MongoDB save error, cleaning up Cloudinary asset:", dbErr)
    if (uploadResult && uploadResult.public_id) {
      await deleteFromCloudinary(uploadResult.public_id).catch(() => {})
    }
    throw new AppError(500, "DB_SAVE_FAILED", "Failed to save quotation metadata.")
  }
}

export async function listQuotes(params: {
  search?: string
  page?: number
  limit?: number
  sort?: string
}) {
  const page = Math.max(1, Number(params.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(params.limit) || 20))
  const skip = (page - 1) * limit

  const filter: any = {}

  if (params.search && params.search.trim()) {
    const regex = new RegExp(params.search.trim(), "i")
    filter.$or = [
      { title: regex },
      { clientName: regex },
      { companyName: regex },
      { quotationNumber: regex },
      { projectName: regex },
    ]
  }

  let sortOption: any = { createdAt: -1 }
  if (params.sort === "quotationDate") {
    sortOption = { quotationDate: -1, createdAt: -1 }
  } else if (params.sort === "clientName") {
    sortOption = { clientName: 1 }
  }

  const [quotes, total] = await Promise.all([
    Quote.find(filter).sort(sortOption).skip(skip).limit(limit).lean(),
    Quote.countDocuments(filter),
  ])

  const mapped = quotes.map((doc) => {
    const { _id, __v, ...rest } = doc
    return { ...rest, id: doc.legacyId }
  })

  return {
    quotes: mapped,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  }
}

export async function getQuoteById(id: string) {
  const quote = await Quote.findOne({
    $or: [{ legacyId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined }],
  }).lean()

  if (!quote) {
    throw new AppError(404, "NOT_FOUND", "Quotation record not found.")
  }

  const { _id, __v, ...rest } = quote
  return { ...rest, id: quote.legacyId }
}

export async function updateQuote(id: string, input: UpdateQuoteInput, user: AuthUser) {
  const quote = await Quote.findOne({
    $or: [{ legacyId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined }],
  })

  if (!quote) {
    throw new AppError(404, "NOT_FOUND", "Quotation record not found.")
  }

  if (input.title !== undefined) quote.title = input.title.trim()
  if (input.clientName !== undefined) quote.clientName = input.clientName.trim()
  if (input.companyName !== undefined) quote.companyName = input.companyName.trim()
  if (input.quotationNumber !== undefined) quote.quotationNumber = input.quotationNumber.trim()
  if (input.quotationDate !== undefined) {
    quote.quotationDate = input.quotationDate ? new Date(input.quotationDate) : undefined
  }
  if (input.projectName !== undefined) quote.projectName = input.projectName.trim()
  if (input.notes !== undefined) quote.notes = input.notes.trim()
  if (input.linkedInquiryId !== undefined) quote.linkedInquiryId = input.linkedInquiryId
  if (input.linkedLeadId !== undefined) quote.linkedLeadId = input.linkedLeadId
  if (input.tags !== undefined) quote.tags = input.tags

  await quote.save()

  await logActivity({
    user: user.name || user.email,
    action: "Updated Quotation Metadata",
    entity: "quote",
    resourceId: quote.legacyId,
    metadata: { title: quote.title, quotationNumber: quote.quotationNumber },
  })

  const lean = quote.toObject()
  const { _id, __v, ...rest } = lean
  return { ...rest, id: quote.legacyId }
}

export async function deleteQuote(id: string, user: AuthUser) {
  const quote = await Quote.findOne({
    $or: [{ legacyId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined }],
  })

  if (!quote) {
    throw new AppError(404, "NOT_FOUND", "Quotation record not found.")
  }

  // Delete from Cloudinary
  if (quote.file?.publicId) {
    await deleteFromCloudinary(quote.file.publicId).catch((err) => {
      console.warn("[QUOTE SERVICE] Cloudinary asset deletion warning:", err)
    })
  }

  // Remove document from MongoDB
  await quote.deleteOne()

  await logActivity({
    user: user.name || user.email,
    action: "Deleted Quotation PDF",
    entity: "quote",
    resourceId: id,
    metadata: { title: quote.title, quotationNumber: quote.quotationNumber },
  })

  return { success: true, message: "Quotation record deleted successfully." }
}

export async function streamQuotePdf(id: string, res: Response, isDownload: boolean, user: AuthUser) {
  const quote = await Quote.findOne({
    $or: [{ legacyId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined }],
  }).lean()

  if (!quote || !quote.file?.url) {
    throw new AppError(404, "NOT_FOUND", "Quotation PDF not found.")
  }

  try {
    const fetchRes = await fetch(quote.file.url)
    if (!fetchRes.ok) {
      throw new AppError(404, "FILE_FETCH_ERROR", "Failed to retrieve PDF file from cloud storage.")
    }

    const arrayBuffer = await fetchRes.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const disposition = isDownload ? "attachment" : "inline"
    const safeFilename = encodeURIComponent(quote.file.originalName || `${quote.title}.pdf`)

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `${disposition}; filename="${safeFilename}"`)
    res.setHeader("Content-Length", buffer.length)
    res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate")

    if (isDownload) {
      await logActivity({
        user: user.name || user.email,
        action: "Downloaded Quotation PDF",
        entity: "quote",
        resourceId: quote.legacyId,
        metadata: { title: quote.title, filename: quote.file.originalName },
      })
    }

    res.send(buffer)
  } catch (err: any) {
    console.error("[QUOTE SERVICE] Stream PDF error:", err)
    if (!res.headersSent) {
      throw new AppError(500, "STREAM_FAILED", "Failed to stream quotation PDF.")
    }
  }
}
