// Bridges StockSearchForm → fetchHistoricalData → ChartLineInteractive + AnalyticsTable

"use client"
import { useState } from "react"
import { ChartLineInteractive } from "@/components/ui/chart-line-interactive"
import { StockSearchForm } from "@/components/process/stock-search-form"
import fetchHistoricalData from "@/utils/historical"
import { AnalyticsTable } from "./analytics-table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart2, Loader2 } from "lucide-react"

export default function Dashboard() {
  const [chartData, setChartData] = useState<any>(null)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [symbol, setSymbol] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

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

  return (
    <div className="space-y-5">

      <StockSearchForm onSearch={handleSearch} />

      {loading && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
            <Loader2 className="size-8 animate-spin" />
            <p className="text-sm font-medium">Fetching market data…</p>
          </CardContent>
        </Card>
      )}

      {!loading && error && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="py-6 text-center text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      {!loading && !error && !chartData && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
            <BarChart2 className="size-10 opacity-30" />
            <p className="text-sm">Enter tickers and a date range above, then click <strong>Analyze</strong>.</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && chartData && (
        <>
          <ChartLineInteractive data={chartData} ticker={symbol} />

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Analytics</CardTitle>
              <CardDescription>
                Performance summary for {symbol.join(', ')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsTable analyticsData={analyticsData} />
            </CardContent>
          </Card>
        </>
      )}

    </div>
  )
}
