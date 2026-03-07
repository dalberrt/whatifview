import { motion } from "framer-motion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table"

export function AnalyticsTable({ analyticsData }: { analyticsData?: Record<string, any> }) {

  if (!analyticsData) {
    return (
      <p className="text-muted-foreground text-center py-4 text-sm">
        No analytics data yet. Search for stocks to see results.
      </p>
    )
  }

  const tickers = Object.keys(analyticsData)

  return (
    <Table>
      <TableHeader>
        {/* Using motion.tr here since TableRow doesn't forward refs */}
        <motion.tr
          className="border-b"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <TableHead>Ticker</TableHead>
          <TableHead className="text-right">Total Invested</TableHead>
          <TableHead className="text-right">Shares Held</TableHead>
          <TableHead className="text-right">Last Price</TableHead>
          <TableHead className="text-right">Returns</TableHead>
          <TableHead className="text-right">% Returns</TableHead>
        </motion.tr>
      </TableHeader>
      <TableBody>
        {tickers.map((ticker, i) => {
          const d = analyticsData[ticker]
          const positive = d.returns >= 0
          return (
            <motion.tr
              key={ticker}
              className="border-b transition-colors hover:bg-muted/50 last:border-0"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: 'spring',
                stiffness: 320,
                damping: 30,
                delay: 0.06 + i * 0.07,
              }}
            >
              <TableCell className="font-mono font-semibold text-left">{ticker}</TableCell>
              <TableCell className="text-right tabular-nums">
                ${d.total_invested.toFixed(2)}
              </TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {d.shares_held.toFixed(4)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                ${d.last_price.toFixed(2)}
              </TableCell>
              <TableCell className={`text-right tabular-nums font-medium ${positive ? 'text-emerald-500' : 'text-red-500'}`}>
                {positive ? '+' : ''}${d.returns.toFixed(2)}
              </TableCell>
              <TableCell className={`text-right tabular-nums font-semibold ${positive ? 'text-emerald-500' : 'text-red-500'}`}>
                {positive ? '+' : ''}{d.percentage_returns.toFixed(2)}%
              </TableCell>
            </motion.tr>
          )
        })}
      </TableBody>
    </Table>
  )
}
