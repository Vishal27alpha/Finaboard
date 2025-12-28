

export type WidgetType = "table" | "card" | "chart"

export type ChartInterval = "daily" | "weekly" | "monthly"

export type ChartType = "line" | "candlestick"

export type FormatType =
  | "number"
  | "currency"
  | "percentage"
  | "date"
  | "text"



export interface FieldFormat {
  type: FormatType
  decimals?: number
  prefix?: string
  suffix?: string
  currencySymbol?: string
}



export interface FieldConfig {
  key: string              
  label: string               
  visible: boolean
  format?: FieldFormat
  sortable?: boolean
}



export interface Widget {
  id: string
  type: WidgetType
  title: string
  description?: string
  config: WidgetConfig
  position: { x: number; y: number }
  size: { width: number; height: number }
}


export interface WidgetConfig {

  tableType?: "stocks" | "watchlist" | "gainers"
  pageSize?: number


  cardType?: "watchlist" | "gainers" | "performance" | "financial"


  chartType?: ChartType
  interval?: ChartInterval
  symbol?: string

  
  apiEndpoint?: string       
  dataPath?: string       
  refreshInterval?: number   



  fields?: FieldConfig[]
}



export interface ChartDataPoint {
  date: string
  open?: number
  high?: number
  low?: number
  close: number
  volume?: number
}
export interface StockData {
  symbol: string
  price?: number
  open?: number
  high?: number
  low?: number
  change?: number
  changePercent?: number

  
  [key: string]: any
}

