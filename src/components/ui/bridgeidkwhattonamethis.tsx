// this bridges utils historical, stock-search-forms and chart-line-interactive
//so that value from form flows into function from historical, and chartdata that returns from historical flows into the chart

"use client"
import { useState } from "react"
import { ChartLineInteractive } from "@/components/ui/chart-line-interactive"
import { StockSearchForm } from "@/components/ui/stock-search-form"
import fetchHistoricalData from "@/utils/historical"

function Analytics() {
  // todo: display table-like analytics with badges at the bottom to show $$$ invested, $$$ returns and % returns, and maybe a table of transactions (what price bought and how much)
  return (
    <main>
      
    </main>
  )
}

export default function Dashboard() {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState(["Pick a Stock!"]);

  const handleSearch = async (ticker1: string, ticker2: string, p1: number, p2: number, entry: number, reinvest_amount: number, reinvest_interval: number) => {
    setLoading(true)
    try {
      let tickers = [ticker1,ticker2]
      const json = await fetchHistoricalData(tickers, p1, p2, entry, reinvest_amount, reinvest_interval)
      // console.log("Fetched Data:", json)    //delet later
      setChartData(json)
      setSymbol(tickers)
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