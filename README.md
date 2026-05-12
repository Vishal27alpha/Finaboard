# FinBoard - Customizable Finance Dashboard

A modern, customizable finance dashboard built with Next.js that allows users to create their own real-time finance monitoring dashboard with various financial data widgets.

## Features

- **Widget Management System**: Add, remove, and rearrange finance widgets with drag-and-drop
- **Multiple Widget Types**:
  - **Tables**: Paginated stock lists with search and filters
  - **Finance Cards**: Market gainers, watchlists, and performance data
  - **Charts**: Line and candlestick charts with multiple intervals
- **Real-time Data**: Live stock data updates with configurable refresh intervals
- **Dark/Light Mode**: Professional theme optimized for financial data
- **Data Persistence**: Dashboard layouts persist across sessions
- **Responsive Design**: Fully responsive across all devices

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand with persistence
- **Charts**: Recharts
- **Drag & Drop**: dnd-kit
- **UI Components**: shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An API key from a financial data provider (Alpha Vantage, Finnhub, etc.)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Add your API key to environment variables:
   ```bash
   NEXT_PUBLIC_FINANCE_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. **Add Widgets**: Click "Add Widget" to create new finance data widgets
2. **Configure**: Choose widget type (Table, Card, or Chart) and configure options
3. **Arrange**: Drag widgets to rearrange your dashboard layout
4. **Customize**: Each widget can be configured individually
5. **Persist**: Your dashboard automatically saves and restores on page reload

## API Integration

The dashboard currently uses mock data for demonstration. To integrate real financial APIs:

1. Update `lib/finance-api.ts` with your chosen provider's endpoints
2. Replace mock functions with actual API calls
3. Handle rate limiting and error states
4. Add your API key to environment variables

### Recommended APIs

- **Alpha Vantage**: Free tier with 5 requests/minute
- **Finnhub**: Real-time stock data
- **IndianAPI**: Indian stock market data
  - Example local route: `/api/indian-stock?name=Reliance`

## Project Structure

```
├── app/                    # Next.js app directory
├── components/            
│   ├── widgets/           # Widget components
│   ├── ui/                # shadcn/ui components
│   └── ...                # Other components
├── lib/
│   ├── types.ts           # TypeScript types
│   ├── finance-api.ts     # API integration layer
│   └── store.ts           # Zustand store
└── hooks/                 # Custom React hooks
```

## License

MIT License
