/*import type { FieldFormat } from "./types"

export function formatValue(value: any, format?: FieldFormat): string {
  console.log("value,format", value, format) 
  if (value === null || value === undefined) return "-"

  if (!format) return String(value)

  switch (format.type) {
    case "currency": {
      const num = Number(value)
      if (isNaN(num)) return String(value)
      const symbol = format.currencySymbol || "$"
      const decimals = format.decimals ?? 2
      return `${symbol}${num.toFixed(decimals)}`
    }

    case "percentage": {
      const num = Number(value)
      if (isNaN(num)) return String(value)
      const decimals = format.decimals ?? 2
      return `${num.toFixed(decimals)}%`
    }

    case "number": {
      const num = Number(value)
      if (isNaN(num)) return String(value)
      const decimals = format.decimals ?? 0
      const formatted = num.toFixed(decimals)
      const prefix = format.prefix || ""
      const suffix = format.suffix || ""
      return `${prefix}${formatted}${suffix}`
    }

    case "date": {
      try {
        const date = new Date(value)
        if (isNaN(date.getTime())) return String(value)
        return date.toLocaleDateString()
      } catch {
        return String(value)
      }
    }

    case "text":
    default:
      return String(value)
  }
}

export function getNestedValue(obj: any, path: string): any {
  if (!path || !obj) return obj

  // For paths with dots that are NOT property accessors (e.g., "Global Quote", "05. price"),
  // treat the entire string as a single key using bracket notation
  // Only split on dots if it looks like a nested path (e.g., "data.items.0")

  // Check if path looks like a nested accessor (multiple segments, no leading digits)
  const hasNestedDots = path.includes(".") && !path.match(/^[\d.]/g)

  if (!hasNestedDots) {
    // Direct key access using bracket notation for keys with dots/spaces
    console.log("[v0] getNestedValue - Direct key access:", { path, value: obj[path] })
    return obj[path]
  }

  // Handle nested paths (e.g., "data.items.0")
  const keys = path.split(".")
  let current = obj

  for (const key of keys) {
    if (current === null || current === undefined) {
      console.log("[v0] getNestedValue - Path not found at key:", key)
      return undefined
    }
    current = current[key]
  }

  console.log("[v0] getNestedValue - Nested path result:", { path, result: current })
  return current
}

export function getFieldValue(obj: any, fieldKey: string): any {
  if (!obj || !fieldKey) return undefined
 
  const value = obj[fieldKey]
 
  return value ?? undefined
}*/
import type { FieldFormat } from "./types"

export function formatValue(value: any, format?: FieldFormat): string {
  if (value === null || value === undefined) return "-"

  if (!format) return String(value)

  switch (format.type) {
    case "currency": {
      const num = Number(value)
      if (isNaN(num)) return String(value)
      const symbol = format.currencySymbol || "$"
      const decimals = format.decimals ?? 2
      return `${symbol}${num.toFixed(decimals)}`
    }

    case "percentage": {
      const num = Number(value)
      if (isNaN(num)) return String(value)
      const decimals = format.decimals ?? 2
      return `${num.toFixed(decimals)}%`
    }

    case "number": {
      const num = Number(value)
      if (isNaN(num)) return String(value)
      const decimals = format.decimals ?? 0
      return num.toFixed(decimals)
    }

    case "date": {
      const date = new Date(value)
      if (isNaN(date.getTime())) return String(value)
      return date.toLocaleDateString()
    }

    default:
      return String(value)
  }
}

/**
 * ✅ ALWAYS try direct key access first
 * Works for:
 * - "Global Quote"
 * - "05. price"
 * - "01. symbol"
 */
export function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) return undefined

  if (obj[path] !== undefined) {
    return obj[path]
  }

  const parts = path.split(".")
  let current = obj

  for (const part of parts) {
    if (current == null) return undefined
    current = current[part]
  }

  return current
}

export function getFieldValue(obj: any, fieldKey: string): any {
  if (!obj || !fieldKey) return undefined
  return obj[fieldKey]
}

