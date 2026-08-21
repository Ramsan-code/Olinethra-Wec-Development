import { describe, expect, it } from "vitest"
import { paginationMeta, parsePagination, slugify } from "../src/utils/helpers.js"

describe("request helpers", () => {
  it("creates safe URL slugs", () => expect(slugify("  Hello, Olinethra!  ")).toBe("hello-olinethra"))
  it("bounds pagination", () => expect(parsePagination({ page: "-2", limit: "999" })).toEqual({ page: 1, limit: 100, skip: 0 }))
  it("computes pagination metadata", () => expect(paginationMeta(2, 20, 45)).toEqual({ page: 2, limit: 20, total: 45, totalPages: 3 }))
})
