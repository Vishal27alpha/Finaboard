import type { StockData, ChartDataPoint } from "./types"

// Mock data for demo - replace with real API calls
const MOCK_STOCKS: StockData[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 178.72,
    change: 2.45,
    changePercent: 1.39,
    volume: 52340000,
    marketCap: 2800000000000,
    high: 180.25,
    low: 176.5,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 378.91,
    change: -1.23,
    changePercent: -0.32,
    volume: 28450000,
    marketCap: 2820000000000,
    high: 382.1,
    low: 377.8,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 141.8,
    change: 3.67,
    changePercent: 2.66,
    volume: 32100000,
    marketCap: 1780000000000,
    high: 142.9,
    low: 139.5,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 178.35,
    change: 4.21,
    changePercent: 2.42,
    volume: 48200000,
    marketCap: 1850000000000,
    high: 180.0,
    low: 175.9,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 248.5,
    change: -5.8,
    changePercent: -2.28,
    volume: 98500000,
    marketCap: 790000000000,
    high: 255.2,
    low: 246.1,
  },
]

const MOCK_GAINERS: StockData[] = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 495.22,
    change: 18.45,
    changePercent: 3.87,
    volume: 45600000,
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    price: 485.33,
    change: 15.2,
    changePercent: 3.23,
    volume: 18900000,
  },
  {
    symbol: "AMD",
    name: "Advanced Micro Devices",
    price: 165.78,
    change: 8.9,
    changePercent: 5.67,
    volume: 55200000,
  },
]

export async function fetchStocks(type: "stocks" | "watchlist" | "gainers" = "stocks"): Promise<StockData[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (type === "gainers") {
    return MOCK_GAINERS
  }

  return MOCK_STOCKS
}

export async function fetchChartData(symbol: string, interval = "daily"): Promise<ChartDataPoint[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Generate mock chart data
  const days = interval === "daily" ? 30 : interval === "weekly" ? 52 : 12
  const basePrice = 150

  return Array.from({ length: days }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (days - i))

    const randomChange = (Math.random() - 0.5) * 10
    const open = basePrice + randomChange
    const close = open + (Math.random() - 0.5) * 5
    const high = Math.max(open, close) + Math.random() * 3
    const low = Math.min(open, close) - Math.random() * 3

    return {
      date: date.toISOString().split("T")[0],
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 100000000),
    }
  })
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
}
