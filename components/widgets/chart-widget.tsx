/*"use client"

import { useEffect, useState } from "react"
import { fetchChartData } from "@/lib/finance-api"
import type { WidgetConfig, ChartInterval, ChartDataPoint } from "@/lib/types"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

export function ChartWidget({ config }: ChartWidgetProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [interval, setInterval] = useState<ChartInterval>(
    config.interval || "daily"
  )

  useEffect(() => {
    loadChartData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.symbol, interval, config.apiEndpoint])
  

  const loadChartData = async () => {
    setLoading(true)
    try {
      if (config.apiEndpoint) {
        console.warn(
          "Custom API endpoints are not supported for charts. Falling back to time-series API."
        )
      }

      const data = await fetchChartData(
        config.symbol || "AAPL",
        interval
      )

      setChartData(data)
    } catch (error) {
      console.error("Failed to load chart data:", error)
      setChartData([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  // Candlestick placeholder
  if (config.chartType === "candlestick") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Candlestick charts coming soon
          </span>
          <Select
            value={interval}
            onValueChange={(value) => setInterval(value as ChartInterval)}
          >
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

        <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
          <p className="text-muted-foreground">
            Candlestick chart visualization
          </p>
        </div>
      </div>
    )
  }

  // Time-series contract (NOT configurable)
  const dataKey = "close"
  const dateKey = "date"

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {config.symbol || "AAPL"}
        </span>

        <Select
          value={interval}
          onValueChange={(value) => setInterval(value as ChartInterval)}
        >
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
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />

          <XAxis
            dataKey={dateKey}
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
            tickFormatter={(value) => {
              const date = new Date(value)
              return `${date.getMonth() + 1}/${date.getDate()}`
            }}
          />

          <YAxis
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
            domain={["dataMin - 5", "dataMax + 5"]}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
            labelStyle={{
              color: "hsl(var(--popover-foreground))",
            }}
          />

          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
*/
"use client"

import { useEffect, useState } from "react"
import { fetchChartData } from "@/lib/finance-api"
import type { WidgetConfig, ChartInterval } from "@/lib/types"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

export function ChartWidget({ config }: ChartWidgetProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [interval, setInterval] = useState<ChartInterval>(config.interval || "daily")

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const chartData = await fetchChartData(config.symbol || "AAPL", interval)
        setData(chartData)
      } catch (e) {
        console.error("Chart load failed:", e)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [config.symbol, interval])

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">{config.symbol || "AAPL"}</span>
        <Select value={interval} onValueChange={(v) => setInterval(v as ChartInterval)}>
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
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="close" stroke="#2563eb" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
