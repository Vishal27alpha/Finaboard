"use client"

import { useEffect, useMemo, useState } from "react"
import { fetchChartData } from "@/lib/finance-api"
import { getFieldValue, getNestedValue } from "@/lib/format-utils"
import type { ChartInterval, WidgetConfig } from "@/lib/types"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ChartWidgetProps {
  config: WidgetConfig
}

function normalizeApiRows(responseData: any): any[] {
  if (Array.isArray(responseData)) {
    return responseData
  }

  if (responseData && typeof responseData === "object") {
    return [responseData]
  }

  return []
}

function looksNumeric(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value)
  if (typeof value === "string" && value.trim() !== "") {
    return Number.isFinite(Number(value.replace(/,/g, "")))
  }
  return false
}

function toNumber(value: unknown) {
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, ""))
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function inferXAxisField(visibleFields: string[]) {
  return (
    visibleFields.find((key) => /date|time|label|name|x/i.test(key)) ||
    visibleFields[0] ||
    "date"
  )
}

function inferLineValueField(rows: any[], visibleFields: string[], xField: string) {
  const candidates = visibleFields.filter((key) => key !== xField)

  const preferred =
    candidates.find((key) => /close|price|value|last|ltp|open|high|low/i.test(key)) ||
    candidates.find((key) => rows.some((row) => looksNumeric(getFieldValue(row, key))))

  return preferred || "close"
}

function inferCandleField(rows: any[], visibleFields: string[], matcher: RegExp) {
  return (
    visibleFields.find((key) => matcher.test(key)) ||
    visibleFields.find((key) => rows.some((row) => looksNumeric(getFieldValue(row, key))))
  )
}

export function ChartWidget({ config }: ChartWidgetProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedInterval, setSelectedInterval] = useState<ChartInterval>(config.interval || "daily")

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        let responseData: any

        if (config.apiEndpoint) {
          const response = await fetch(config.apiEndpoint, { cache: "no-store" })
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
          }

          responseData = await response.json()
          if (config.dataPath) {
            responseData = getNestedValue(responseData, config.dataPath)
          }
        } else {
          responseData = await fetchChartData(config.symbol || "AAPL", selectedInterval)
        }

        if (!cancelled) {
          setData(normalizeApiRows(responseData))
        }
      } catch (e) {
        if (!cancelled) {
          const message = e instanceof Error ? e.message : "Failed to load chart data"
          setError(message)
          setData([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    const refreshSeconds = config.refreshInterval ?? 30
    if (refreshSeconds > 0) {
      const intervalId = window.setInterval(load, refreshSeconds * 1000)
      return () => {
        cancelled = true
        window.clearInterval(intervalId)
      }
    }

    return () => {
      cancelled = true
    }
  }, [config.apiEndpoint, config.dataPath, config.refreshInterval, config.symbol, selectedInterval])

  const visibleFields = useMemo(
    () => (config.fields || []).filter((field) => field.visible).map((field) => field.key),
    [config.fields],
  )

  const xField = useMemo(() => inferXAxisField(visibleFields), [visibleFields])
  const lineValueField = useMemo(
    () => inferLineValueField(data, visibleFields, xField),
    [data, visibleFields, xField],
  )

  const openField = useMemo(
    () => inferCandleField(data, visibleFields, /(^|\.)(open)$/i),
    [data, visibleFields],
  )
  const highField = useMemo(
    () => inferCandleField(data, visibleFields, /(^|\.)(high)$/i),
    [data, visibleFields],
  )
  const lowField = useMemo(
    () => inferCandleField(data, visibleFields, /(^|\.)(low)$/i),
    [data, visibleFields],
  )
  const closeField = useMemo(
    () => inferCandleField(data, visibleFields, /(^|\.)(close|price)$/i),
    [data, visibleFields],
  )

  const chartData = useMemo(() => {
    if (config.chartType === "candlestick") {
      return data
        .map((row, index) => {
          const label = getFieldValue(row, xField) ?? `Point ${index + 1}`
          const open = openField ? toNumber(getFieldValue(row, openField)) : null
          const high = highField ? toNumber(getFieldValue(row, highField)) : null
          const low = lowField ? toNumber(getFieldValue(row, lowField)) : null
          const close = closeField ? toNumber(getFieldValue(row, closeField)) : null

          if ([open, high, low, close].some((value) => value === null)) {
            return null
          }

          return {
            label: String(label),
            open,
            high,
            low,
            close,
          }
        })
        .filter(Boolean) as Array<{
        label: string
        open: number
        high: number
        low: number
        close: number
      }>
    }

    return data
      .map((row, index) => {
        const label = getFieldValue(row, xField) ?? `Point ${index + 1}`
        const value = toNumber(getFieldValue(row, lineValueField))
        if (value === null) return null

        return {
          label: String(label),
          value,
        }
      })
      .filter(Boolean) as Array<{ label: string; value: number }>
  }, [closeField, config.chartType, data, highField, lineValueField, lowField, openField, xField])

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>
  }

  if (config.chartType === "candlestick") {
    if (!openField || !highField || !lowField || !closeField) {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">{config.symbol || "Custom Chart"}</span>
            <Select value={selectedInterval} onValueChange={(v) => setSelectedInterval(v as ChartInterval)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            Candlestick charts need visible fields for open, high, low, and close.
          </div>
        </div>
      )
    }

    if (chartData.length === 0) {
      return <div className="text-sm text-muted-foreground">No plottable candlestick data found.</div>
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">{config.symbol || "Custom Chart"}</span>
          <Select value={selectedInterval} onValueChange={(v) => setSelectedInterval(v as ChartInterval)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="open" stroke="#64748b" dot={false} />
            <Line type="monotone" dataKey="high" stroke="#22c55e" dot={false} />
            <Line type="monotone" dataKey="low" stroke="#ef4444" dot={false} />
            <Line type="monotone" dataKey="close" stroke="#2563eb" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (chartData.length === 0) {
    return <div className="text-sm text-muted-foreground">No plottable chart data found.</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">{config.symbol || "Custom Chart"}</span>
        <Select value={selectedInterval} onValueChange={(v) => setSelectedInterval(v as ChartInterval)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#2563eb" dot={chartData.length === 1} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
