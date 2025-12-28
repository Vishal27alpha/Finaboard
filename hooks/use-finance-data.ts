"use client"

import { useEffect, useState } from "react"
import { fetchStocks, fetchChartData } from "@/lib/finance-api"
import type { StockData, ChartDataPoint } from "@/lib/types"

export function useStocks(type: "stocks" | "watchlist" | "gainers" = "stocks", refreshInterval?: number) {
  const [data, setData] = useState<StockData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const stocks = await fetchStocks(type)
        setData(stocks)
        setError(null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    if (refreshInterval) {
      const interval = setInterval(loadData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [type, refreshInterval])

  return { data, loading, error }
}

export function useChartData(symbol: string, interval = "daily", refreshInterval?: number) {
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const chartData = await fetchChartData(symbol, interval)
        setData(chartData)
        setError(null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    if (refreshInterval) {
      const interval = setInterval(loadData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [symbol, interval, refreshInterval])

  return { data, loading, error }
}
