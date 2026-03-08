// Bridges StockSearchForm → fetchHistoricalData → ChartLineInteractive + AnalyticsTable

"use client"
import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChartLineInteractive } from "@/components/ui/chart-line-interactive"
import { StockSearchForm } from "@/components/process/stock-search-form"
import fetchHistoricalData from "@/utils/historical"
import { AnalyticsTable } from "./analytics-table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart2, Loader2, History } from "lucide-react"
import { getSession, setSession } from "@/utils/cache"

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

const fadeSlide = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -10 },
  transition: { duration: 0.28, ease: EASE },
}

export default function Dashboard() {
  const [chartData, setChartData]         = useState<any>(null)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading]             = useState(false)
  const [symbol, setSymbol]               = useState<string[]>([])
  const [error, setError]                 = useState<string | null>(null)
  const [restored, setRestored]           = useState(false)

  // Restore last session on mount
  useEffect(() => {
    const session = getSession()
    if (session) {
      setChartData(session.chartData)
      setAnalyticsData(session.analyticsData)
      setSymbol(session.symbols)
      setRestored(true)
    }
  }, [])

  const handleSearch = async (
    tickers: string[],
    p1: number,
    p2: number,
    entry: string,
    reinvest_amount: string,
    reinvest_interval: string
  ) => {
    setLoading(true)
    setError(null)
    setRestored(false)
    try {
      const result = await fetchHistoricalData(
        tickers, p1, p2,
        Number(entry),
        Number(reinvest_amount),
        Number(reinvest_interval)
      )
      if (result) {
        setChartData(result.chartData)
        setAnalyticsData(result.analyticsData)
        setSymbol(tickers)
        setSession({ chartData: result.chartData, analyticsData: result.analyticsData, symbols: tickers })
      } else {
        setError('No data returned. Check your tickers and date range.')
      }
    } catch (err) {
      console.error("Error:", err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const stateKey = loading
    ? 'loading'
    : error
      ? 'error'
      : !chartData
        ? 'empty'
        : 'results'

  return (
    <div className="space-y-5">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <StockSearchForm onSearch={handleSearch} />
      </motion.div>

      <AnimatePresence mode="wait">
        
        {stateKey === 'loading' && (
          <motion.div key="loading" {...fadeSlide}>
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
                <Loader2 className="size-8 animate-spin opacity-60" />
                <p className="text-sm font-medium">Fetching market data…</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {stateKey === 'error' && (
          <motion.div key="error" {...fadeSlide}>
            <Card className="border-destructive/40 bg-destructive/5">
              <CardContent className="py-7 text-center text-sm text-destructive font-medium">
                {error}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {stateKey === 'empty' && (
          <motion.div key="empty" {...fadeSlide}>
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center gap-4 py-20 text-muted-foreground">
                <div className="p-4 rounded-2xl bg-muted">
                  <BarChart2 className="size-10 opacity-40" />
                </div>
                <p className="text-sm text-center max-w-[280px]">
                  Enter tickers and a date range above,{' '}
                  then click <span className="font-semibold text-foreground">Analyze</span>.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {stateKey === 'results' && (
          <motion.div key="results" className="space-y-5" {...fadeSlide}>
            {restored && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <History className="size-3.5" />
                Showing your last session — run Analyze to refresh
              </motion.div>
            )}

            <ChartLineInteractive data={chartData} ticker={symbol} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.35, ease: EASE }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Analytics</CardTitle>
                  <CardDescription>
                    Performance breakdown for {symbol.join(', ')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalyticsTable analyticsData={analyticsData} />
                </CardContent>
              </Card>
            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
