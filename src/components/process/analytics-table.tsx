import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table"

type ColKey = 'ticker' | 'total_invested' | 'shares_held' | 'avg_price' | 'last_price' | 'returns' | 'pct_returns'
type SortDir = 'asc' | 'desc'

interface ColDef {
  key: ColKey
  label: string
  sortable: boolean
  align: 'left' | 'right'
}

const DEFAULT_COLUMNS: ColDef[] = [
  { key: 'ticker',         label: 'Ticker',         sortable: false, align: 'left'  },
  { key: 'total_invested', label: 'Total Invested',  sortable: true,  align: 'right' },
  { key: 'shares_held',    label: 'Shares Held',     sortable: true,  align: 'right' },
  { key: 'avg_price',      label: 'Avg Price',       sortable: true,  align: 'right' },
  { key: 'last_price',     label: 'Last Price',      sortable: true,  align: 'right' },
  { key: 'returns',        label: 'Returns',         sortable: true,  align: 'right' },
  { key: 'pct_returns',    label: '% Returns',       sortable: true,  align: 'right' },
]


function getValue(key: ColKey, ticker: string, d: Record<string, number>): number | string {
  switch (key) {
    case 'ticker':         return ticker
    case 'total_invested': return d.total_invested
    case 'shares_held':    return d.shares_held
    case 'avg_price':      return d.total_invested / d.shares_held
    case 'last_price':     return d.last_price
    case 'returns':        return d.returns
    case 'pct_returns':    return d.percentage_returns
  }
}

function formatCell(key: ColKey, val: number | string): string {
  if (key === 'ticker') return val as string
  const n = val as number
  switch (key) {
    case 'total_invested': return `$${n.toFixed(2)}`
    case 'shares_held':    return n.toFixed(4)
    case 'avg_price':      return `$${n.toFixed(2)}`
    case 'last_price':     return `$${n.toFixed(2)}`
    case 'returns':        return `${n >= 0 ? '+$' : '-$'}${Math.abs(n).toFixed(2)}`
    case 'pct_returns':    return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`
  }
}

function isColoured(key: ColKey) {
  return key === 'returns' || key === 'pct_returns'
}

export function AnalyticsTable({ analyticsData }: { analyticsData?: Record<string, any> }) {
  const [columns, setColumns]       = useState<ColDef[]>(DEFAULT_COLUMNS)
  const [sortKey, setSortKey]       = useState<ColKey>('returns')
  const [sortDir, setSortDir]       = useState<SortDir>('desc')
  const [dragOver, setDragOver]     = useState<ColKey | null>(null)
  const dragSrc                     = useRef<ColKey | null>(null)

  if (!analyticsData) {
    return (
      <p className="text-muted-foreground text-center py-4 text-sm">
        No analytics data yet. Search for stocks to see results.
      </p>
    )
  }


  const handleSort = (key: ColKey) => {
    if (!columns.find(c => c.key === key)?.sortable) return
    setSortDir(prev => (sortKey === key ? (prev === 'asc' ? 'desc' : 'asc') : 'desc'))
    setSortKey(key)
  }

  const rows = Object.entries(analyticsData as Record<string, Record<string, number>>)
    .map(([ticker, d]) => ({ ticker, d }))
    .sort((a, b) => {
      if (sortKey === 'ticker') return 0
      const va = getValue(sortKey, a.ticker, a.d) as number
      const vb = getValue(sortKey, b.ticker, b.d) as number
      return sortDir === 'asc' ? va - vb : vb - va
    })


  const onDragStart = (key: ColKey) => { dragSrc.current = key }

  const onDragOver = (e: React.DragEvent, key: ColKey) => {
    e.preventDefault()
    if (dragSrc.current && dragSrc.current !== key) setDragOver(key)
  }

  const onDrop = (targetKey: ColKey) => {
    const src = dragSrc.current
    if (!src || src === targetKey) return
    setColumns(prev => {
      const order = [...prev]
      const from  = order.findIndex(c => c.key === src)
      const to    = order.findIndex(c => c.key === targetKey)
      const [moved] = order.splice(from, 1)
      order.splice(to, 0, moved)
      return order
    })
    setDragOver(null)
    dragSrc.current = null
  }

  const onDragEnd = () => {
    setDragOver(null)
    dragSrc.current = null
  }


  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <motion.tr
            className="border-b"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {columns.map(col => {
              const isSorted   = sortKey === col.key
              const isTarget   = dragOver === col.key
              return (
                <TableHead
                  key={col.key}
                  draggable
                  onDragStart={() => onDragStart(col.key)}
                  onDragOver={e => onDragOver(e, col.key)}
                  onDrop={() => onDrop(col.key)}
                  onDragEnd={onDragEnd}
                  className={[
                    'select-none transition-colors',
                    col.align === 'right' ? 'text-right' : 'text-left',
                    col.sortable ? 'cursor-pointer hover:text-foreground' : 'cursor-grab active:cursor-grabbing',
                    isTarget ? 'border-l-2 border-primary/60 bg-accent/40' : '',
                  ].join(' ')}
                  onClick={() => handleSort(col.key)}
                  title={col.sortable ? `Sort by ${col.label}` : `Drag to reorder`}
                >
                  <span className={`inline-flex items-center gap-1 ${col.align === 'right' ? 'flex-row-reverse' : ''}`}>
                    {col.label}
                    {col.sortable && (
                      <span className="text-muted-foreground/60">
                        {isSorted
                          ? sortDir === 'asc'
                            ? <ChevronUp className="size-3" />
                            : <ChevronDown className="size-3" />
                          : <ChevronsUpDown className="size-3 opacity-40" />}
                      </span>
                    )}
                  </span>
                </TableHead>
              )
            })}
          </motion.tr>
        </TableHeader>

        <TableBody>
          {rows.map(({ ticker, d }, i) => (
            <motion.tr
              key={ticker}
              className="border-b transition-colors hover:bg-muted/50 last:border-0"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30, delay: 0.06 + i * 0.07 }}
            >
              {columns.map(col => {
                const raw      = getValue(col.key, ticker, d)
                const label    = formatCell(col.key, raw)
                const positive = typeof raw === 'number' ? raw >= 0 : true
                const coloured = isColoured(col.key)
                return (
                  <TableCell
                    key={col.key}
                    className={[
                      col.align === 'right' ? 'text-right tabular-nums' : 'text-left',
                      col.key === 'ticker' ? 'font-mono font-semibold' : '',
                      coloured
                        ? positive ? 'text-emerald-600 dark:text-emerald-500 font-semibold' : 'text-red-500 font-semibold'
                        : col.key === 'shares_held' ? 'text-muted-foreground' : '',
                      dragOver === col.key ? 'border-l-2 border-primary/40' : '',
                    ].join(' ')}
                  >
                    {label}
                  </TableCell>
                )
              })}
            </motion.tr>
          ))}
        </TableBody>
      </Table>

      <p className="mt-3 text-[11px] text-muted-foreground/60 text-right select-none">
        Drag column headers to reorder · Click to sort
      </p>
    </div>
  )
}
