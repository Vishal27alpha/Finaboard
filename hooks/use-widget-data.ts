
/*"use client"

import { useEffect, useState, useCallback } from "react"
import { getNestedValue } from "@/lib/format-utils"
import { fetchStocks } from "@/lib/finance-api"
import type { WidgetConfig } from "@/lib/types"

const REFRESH_INTERVAL = 30_000 // 30 seconds

export function useWidgetData(config: WidgetConfig) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let responseData: any

      if (config.apiEndpoint) {
        console.log("[v0] Fetching from:", config.apiEndpoint)

        const response = await fetch(config.apiEndpoint)
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        responseData = await response.json()
        console.log("[v0] Raw API response:", responseData)

        // Apply dataPath if provided
        if (config.dataPath) {
          responseData = getNestedValue(responseData, config.dataPath)
          console.log("[v0] After dataPath:", responseData)
        }
      } else {
        // Fallback mock data
        responseData = await fetchStocks(config.tableType as any)
      }

      // ✅ Normalize all API shapes
      let dataArray: any[] = []

      if (Array.isArray(responseData)) {
        dataArray = responseData
      } else if (responseData?.["Global Quote"]) {
        // Alpha Vantage GLOBAL_QUOTE
        dataArray = [responseData["Global Quote"]]
      } else if (responseData) {
        // IndianAPI / generic object
        dataArray = [responseData]
      }

      console.log("[v0] Normalized data array:", dataArray)
      setData(dataArray)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load data"
      console.error("[v0] useWidgetData error:", message)
      setError(message)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [config.apiEndpoint, config.dataPath, config.tableType])

  useEffect(() => {
    // Initial load
    loadData()

    // Auto refresh
    const interval = setInterval(loadData, REFRESH_INTERVAL)

    return () => clearInterval(interval)
  }, [loadData])

  return { data, loading, error }
}*/
"use client"

import { useEffect, useState, useCallback } from "react"
import { getNestedValue } from "@/lib/format-utils"
import { fetchStocks } from "@/lib/finance-api"
import type { WidgetConfig } from "@/lib/types"

const DEFAULT_REFRESH_INTERVAL = 30 // seconds

export function useWidgetData(config: WidgetConfig) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let responseData: any


      if (config.apiEndpoint) {
        console.log("[v0] Fetching from:", config.apiEndpoint)

        const response = await fetch(config.apiEndpoint, {
          cache: "no-store", // always fresh
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        responseData = await response.json()
        console.log("[v0] Raw API response:", responseData)

        // Apply dataPath
        if (config.dataPath) {
          responseData = getNestedValue(responseData, config.dataPath)
          console.log("[v0] After dataPath:", responseData)
        }
      } else {

        responseData = await fetchStocks(config.tableType as any)
      }


      let dataArray: any[] = []

      if (Array.isArray(responseData)) {
        dataArray = responseData
      } else if (responseData?.["Global Quote"]) {
        // Alpha Vantage GLOBAL_QUOTE
        dataArray = [responseData["Global Quote"]]
      } else if (responseData) {
        // IndianAPI / generic object
        dataArray = [responseData]
      }

      console.log("[v0] Normalized data array:", dataArray)
      setData(dataArray)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load data"
      console.error("[v0] useWidgetData error:", message)
      setError(message)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [config.apiEndpoint, config.dataPath, config.tableType])

  useEffect(() => {
    // Initial fetch
    loadData()

 
    const refreshSeconds =
      config.refreshInterval ?? DEFAULT_REFRESH_INTERVAL

    // Disable auto-refresh if 0 or negative
    if (refreshSeconds <= 0) return

    const intervalId = setInterval(
      loadData,
      refreshSeconds * 1000
    )

    return () => clearInterval(intervalId)
  }, [loadData, config.refreshInterval])

  return { data, loading, error }
}



