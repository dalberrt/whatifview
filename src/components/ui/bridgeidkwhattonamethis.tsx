// this bridges utils historical, stock-search-forms and chart-line-interactive
//so that value from form flows into function from historical, and chartdata that returns from historical flows into the chart

"use client"
import { useState } from "react"
import { ChartLineInteractive } from "@/components/ui/chart-line-interactive"
import { StockSearchForm } from "@/components/ui/stock-search-form"
import fetchHistoricalData from "@/utils/historical"

export default function Dashboard() {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState("Pick a Stock!");

  const handleSearch = async (ticker: string, p1: number, p2: number, entry: number) => {
    setLoading(true)
    try {
      const json = await fetchHistoricalData(ticker, p1, p2, entry)
      console.log("Fetched Data:", json)    //delet later
      setChartData(json)
      setSymbol(ticker)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  };

  return (
    <main>
      <StockSearchForm onSearch={handleSearch} />
      
      {loading ? <p>Loading...</p> : <ChartLineInteractive data={chartData} ticker={symbol} />}
    </main>
  );
}