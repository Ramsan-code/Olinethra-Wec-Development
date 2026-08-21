import express from "express"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import morgan from "morgan"
import { corsOptions } from "./config/cors.js"
import cors from "cors"
import { apiRouter } from "./routes/index.js"
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js"
import { generalLimiter } from "./middleware/rateLimit.middleware.js"

export const app = express()

app.disable("x-powered-by")
app.set("trust proxy", 1)
app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: false, limit: "1mb" }))
app.use(cookieParser())
app.use(morgan(":method :url :status :response-time ms"))
app.use("/api/v1", generalLimiter, apiRouter)
app.use(notFoundHandler)
app.use(errorHandler)

