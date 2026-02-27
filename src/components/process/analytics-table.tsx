import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function AnalyticsTable({ analyticsData }: { analyticsData?: Record<string, any> }) {
  
  if (!analyticsData) {
    return <p className="text-muted-foreground text-center p-4">No analytics data yet. Search for stocks to see results.</p>
  }

  const tickers = Object.keys(analyticsData)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ticker</TableHead>
          <TableHead className="text-right">Total Invested</TableHead>
          <TableHead className="text-right">Shares Held</TableHead>
          <TableHead className="text-right">Last Price</TableHead>
          <TableHead className="text-right">Returns</TableHead>
          <TableHead className="text-right">% Returns</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickers.map((ticker) => (
          <TableRow key={ticker}>
            <TableCell className="font-medium text-left">{ticker}</TableCell>
            <TableCell className="text-right">${analyticsData[ticker].total_invested.toFixed(2)}</TableCell>
            <TableCell className="text-right">{analyticsData[ticker].shares_held.toFixed(4)}</TableCell>
            <TableCell className="text-right">${analyticsData[ticker].last_price.toFixed(2)}</TableCell>
            <TableCell className={`text-right ${analyticsData[ticker].returns >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${analyticsData[ticker].returns.toFixed(2)}
            </TableCell>
            <TableCell className={`text-right font-semibold ${analyticsData[ticker].percentage_returns >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {analyticsData[ticker].percentage_returns.toFixed(2)}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}