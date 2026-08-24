import type { Request, Response, NextFunction } from "express"
import * as quoteService from "../services/quote.service.js"
import { AppError } from "../middleware/error.middleware.js"

export function checkQuoteAccess(req: Request) {
  if (!req.user) {
    throw new AppError(401, "UNAUTHORIZED", "Authentication required.")
  }

  // Super Admin & Content Admin have access. Hiring Admin has no access by default.
  if (req.user.role === "Hiring Admin") {
    throw new AppError(403, "FORBIDDEN", "Your admin role is not authorized to access quotation archives.")
  }
}

export async function uploadQuote(req: Request, res: Response, next: NextFunction) {
  try {
    checkQuoteAccess(req)

    if (!req.file) {
      throw new AppError(400, "MISSING_FILE", "A PDF quotation file is required.")
    }

    if (req.file.mimetype !== "application/pdf") {
      throw new AppError(400, "INVALID_FILE_TYPE", "Only PDF documents (.pdf) can be archived.")
    }

    const {
      title,
      clientName,
      companyName,
      quotationNumber,
      quotationDate,
      projectName,
      notes,
      linkedInquiryId,
      linkedLeadId,
      tags,
    } = req.body

    let parsedTags: string[] | undefined
    if (typeof tags === "string") {
      parsedTags = tags.split(",").map((t) => t.trim()).filter(Boolean)
    } else if (Array.isArray(tags)) {
      parsedTags = tags
    }

    const quote = await quoteService.createQuote(
      req.file.buffer,
      req.file.originalname,
      {
        title,
        clientName,
        companyName,
        quotationNumber,
        quotationDate,
        projectName,
        notes,
        linkedInquiryId,
        linkedLeadId,
        tags: parsedTags,
      },
      req.user!
    )

    res.status(201).json({
      success: true,
      message: "Quotation PDF uploaded and archived successfully.",
      data: { quote },
    })
  } catch (error) {
    next(error)
  }
}

export async function listQuotes(req: Request, res: Response, next: NextFunction) {
  try {
    checkQuoteAccess(req)

    const { search, page, limit, sort } = req.query
    const result = await quoteService.listQuotes({
      search: typeof search === "string" ? search : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      sort: typeof sort === "string" ? sort : undefined,
    })

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export async function getQuote(req: Request, res: Response, next: NextFunction) {
  try {
    checkQuoteAccess(req)

    const { id } = req.params
    const quote = await quoteService.getQuoteById(id)

    res.json({
      success: true,
      data: { quote },
    })
  } catch (error) {
    next(error)
  }
}

export async function updateQuote(req: Request, res: Response, next: NextFunction) {
  try {
    checkQuoteAccess(req)

    const { id } = req.params
    const {
      title,
      clientName,
      companyName,
      quotationNumber,
      quotationDate,
      projectName,
      notes,
      linkedInquiryId,
      linkedLeadId,
      tags,
    } = req.body

    const updated = await quoteService.updateQuote(
      id,
      {
        title,
        clientName,
        companyName,
        quotationNumber,
        quotationDate,
        projectName,
        notes,
        linkedInquiryId,
        linkedLeadId,
        tags,
      },
      req.user!
    )

    res.json({
      success: true,
      message: "Quotation metadata updated successfully.",
      data: { quote: updated },
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteQuote(req: Request, res: Response, next: NextFunction) {
  try {
    checkQuoteAccess(req)

    // Only Super Admin can delete quotes for strict audit security
    if (req.user!.role !== "Super Admin") {
      throw new AppError(403, "FORBIDDEN", "Only Super Administrators can delete quotation records.")
    }

    const { id } = req.params
    const result = await quoteService.deleteQuote(id, req.user!)

    res.json({
      success: true,
      message: result.message,
    })
  } catch (error) {
    next(error)
  }
}

export async function viewQuotePdf(req: Request, res: Response, next: NextFunction) {
  try {
    checkQuoteAccess(req)

    const { id } = req.params
    await quoteService.streamQuotePdf(id, res, false, req.user!)
  } catch (error) {
    next(error)
  }
}

export async function downloadQuotePdf(req: Request, res: Response, next: NextFunction) {
  try {
    checkQuoteAccess(req)

    const { id } = req.params
    await quoteService.streamQuotePdf(id, res, true, req.user!)
  } catch (error) {
    next(error)
  }
}
