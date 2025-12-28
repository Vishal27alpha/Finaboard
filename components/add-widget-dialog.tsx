/*"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import type { Widget, WidgetType, ChartInterval, ChartType } from "@/lib/types"
import { useDashboardStore } from "@/lib/store"

export function AddWidgetDialog() {
  const [open, setOpen] = useState(false)
  const [widgetType, setWidgetType] = useState<WidgetType>("table")
  const [title, setTitle] = useState("")
  const addWidget = useDashboardStore((state) => state.addWidget)

  // Table-specific state
  const [tableType, setTableType] = useState<"stocks" | "watchlist" | "gainers">("stocks")

  // Card-specific state
  const [cardType, setCardType] = useState<"watchlist" | "gainers" | "performance" | "financial">("watchlist")

  // Chart-specific state
  const [chartType, setChartType] = useState<ChartType>("line")
  const [interval, setInterval] = useState<ChartInterval>("daily")
  const [symbol, setSymbol] = useState("AAPL")

  const handleAddWidget = () => {
    const baseWidget: Omit<Widget, "config"> = {
      id: `widget-${Date.now()}`,
      type: widgetType,
      title: title || getDefaultTitle(),
      position: { x: 0, y: 0 },
      size: { width: 1, height: 1 },
    }

    let config = {}
    if (widgetType === "table") {
      config = { tableType, pageSize: 10 }
    } else if (widgetType === "card") {
      config = { cardType }
    } else if (widgetType === "chart") {
      config = { chartType, interval, symbol }
    }

    addWidget({ ...baseWidget, config })
    setOpen(false)
    resetForm()
  }

  const getDefaultTitle = () => {
    if (widgetType === "table") return `${tableType.charAt(0).toUpperCase() + tableType.slice(1)} Table`
    if (widgetType === "card") return `${cardType.charAt(0).toUpperCase() + cardType.slice(1)} Card`
    return `${symbol} Chart`
  }

  const resetForm = () => {
    setTitle("")
    setWidgetType("table")
    setTableType("stocks")
    setCardType("watchlist")
    setChartType("line")
    setInterval("daily")
    setSymbol("AAPL")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Widget
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Widget</DialogTitle>
          <DialogDescription>Configure your widget to display financial data</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="widget-type">Widget Type</Label>
            <Select value={widgetType} onValueChange={(value) => setWidgetType(value as WidgetType)}>
              <SelectTrigger id="widget-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="table">Table</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="chart">Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Widget Title</Label>
            <Input
              id="title"
              placeholder={getDefaultTitle()}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {widgetType === "table" && (
            <div className="space-y-2">
              <Label htmlFor="table-type">Table Type</Label>
              <Select value={tableType} onValueChange={(value) => setTableType(value as any)}>
                <SelectTrigger id="table-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stocks">Stocks</SelectItem>
                  <SelectItem value="watchlist">Watchlist</SelectItem>
                  <SelectItem value="gainers">Market Gainers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {widgetType === "card" && (
            <div className="space-y-2">
              <Label htmlFor="card-type">Card Type</Label>
              <Select value={cardType} onValueChange={(value) => setCardType(value as any)}>
                <SelectTrigger id="card-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="watchlist">Watchlist</SelectItem>
                  <SelectItem value="gainers">Market Gainers</SelectItem>
                  <SelectItem value="performance">Performance Data</SelectItem>
                  <SelectItem value="financial">Financial Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {widgetType === "chart" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="symbol">Stock Symbol</Label>
                <Input
                  id="symbol"
                  placeholder="AAPL"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chart-type">Chart Type</Label>
                <Select value={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
                  <SelectTrigger id="chart-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="candlestick">Candlestick Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interval">Interval</Label>
                <Select value={interval} onValueChange={(value) => setInterval(value as ChartInterval)}>
                  <SelectTrigger id="interval">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button onClick={handleAddWidget} className="w-full">
            Add Widget
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}*/
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import type { Widget, WidgetType, ChartInterval, ChartType } from "@/lib/types"
import { useDashboardStore } from "@/lib/store"

export function AddWidgetDialog() {
  const [open, setOpen] = useState(false)
  const [widgetType, setWidgetType] = useState<WidgetType>("table")
  const [title, setTitle] = useState("")
  const addWidget = useDashboardStore((state) => state.addWidget)

  // ✅ NEW: refresh interval (seconds)
  const [refreshInterval, setRefreshInterval] = useState(30)

  // Table-specific state
  const [tableType, setTableType] = useState<"stocks" | "watchlist" | "gainers">("stocks")

  // Card-specific state
  const [cardType, setCardType] = useState<"watchlist" | "gainers" | "performance" | "financial">("watchlist")

  // Chart-specific state
  const [chartType, setChartType] = useState<ChartType>("line")
  const [interval, setInterval] = useState<ChartInterval>("daily")
  const [symbol, setSymbol] = useState("AAPL")

  const handleAddWidget = () => {
    const baseWidget: Omit<Widget, "config"> = {
      id: `widget-${Date.now()}`,
      type: widgetType,
      title: title || getDefaultTitle(),
      position: { x: 0, y: 0 },
      size: { width: 1, height: 1 },
    }

    let config: any = {
      refreshInterval, // ✅ STORED HERE
    }

    if (widgetType === "table") {
      config = { ...config, tableType, pageSize: 10 }
    } else if (widgetType === "card") {
      config = { ...config, cardType }
    } else if (widgetType === "chart") {
      config = { ...config, chartType, interval, symbol }
    }

    addWidget({ ...baseWidget, config })
    setOpen(false)
    resetForm()
  }

  const getDefaultTitle = () => {
    if (widgetType === "table") return `${tableType.charAt(0).toUpperCase() + tableType.slice(1)} Table`
    if (widgetType === "card") return `${cardType.charAt(0).toUpperCase() + cardType.slice(1)} Card`
    return `${symbol} Chart`
  }

  const resetForm = () => {
    setTitle("")
    setWidgetType("table")
    setTableType("stocks")
    setCardType("watchlist")
    setChartType("line")
    setInterval("daily")
    setSymbol("AAPL")
    setRefreshInterval(30) // ✅ reset
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Widget
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Widget</DialogTitle>
          <DialogDescription>
            Configure your widget to display financial data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Widget Type */}
          <div className="space-y-2">
            <Label>Widget Type</Label>
            <Select value={widgetType} onValueChange={(v) => setWidgetType(v as WidgetType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="table">Table</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="chart">Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label>Widget Title</Label>
            <Input
              placeholder={getDefaultTitle()}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Refresh Interval */}
          <div className="space-y-2">
            <Label>Refresh Interval (seconds)</Label>
            <Input
              type="number"
              min={5}
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Minimum 5 seconds. Set to 0 to disable auto refresh.
            </p>
          </div>

          {/* Table */}
          {widgetType === "table" && (
            <div className="space-y-2">
              <Label>Table Type</Label>
              <Select value={tableType} onValueChange={(v) => setTableType(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stocks">Stocks</SelectItem>
                  <SelectItem value="watchlist">Watchlist</SelectItem>
                  <SelectItem value="gainers">Market Gainers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Card */}
          {widgetType === "card" && (
            <div className="space-y-2">
              <Label>Card Type</Label>
              <Select value={cardType} onValueChange={(v) => setCardType(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="watchlist">Watchlist</SelectItem>
                  <SelectItem value="gainers">Market Gainers</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Chart */}
          {widgetType === "chart" && (
            <>
              <div className="space-y-2">
                <Label>Stock Symbol</Label>
                <Input
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                />
              </div>

              <div className="space-y-2">
                <Label>Chart Type</Label>
                <Select value={chartType} onValueChange={(v) => setChartType(v as ChartType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">Line</SelectItem>
                    <SelectItem value="candlestick">Candlestick</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Interval</Label>
                <Select value={interval} onValueChange={(v) => setInterval(v as ChartInterval)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button onClick={handleAddWidget} className="w-full">
            Add Widget
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

