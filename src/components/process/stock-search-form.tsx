import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Search, Plus, X } from "lucide-react"

interface StockSearchFormProps {
  onSearch: (tickers: string[], p1: number, p2: number, entry: string, reinvest_amount: string, reinvest_interval: string) => void
}

export function StockSearchForm({ onSearch }: StockSearchFormProps) {
  const [tickers, setTickers] = useState<string[]>(['', ''])
  const [formData, setFormData] = useState({
    start: '', end: '', entry: '', reinvest_amount: '', reinvest_interval: ''
  })

  const updateTicker = (i: number, val: string) =>
    setTickers(prev => prev.map((t, idx) => idx === i ? val.toUpperCase() : t))

  const addTicker = () => setTickers(prev => [...prev, ''])

  const removeTicker = (i: number) =>
    setTickers(prev => prev.filter((_, idx) => idx !== i))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const active = tickers.filter(t => t.trim() !== '')
    if (active.length === 0) return
    const p1 = Math.floor(new Date(formData.start).getTime() / 1000)
    const p2 = Math.floor(new Date(formData.end).getTime() / 1000)
    onSearch(active, p1, p2, formData.entry, formData.reinvest_amount, formData.reinvest_interval)
  }

  const set = (key: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormData(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-card shadow-sm overflow-hidden">

      <div className="px-5 pt-5 pb-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tickers
          </Label>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={addTicker}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            <Plus className="size-3" />
            Add ticker
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tickers.map((ticker, i) => (
            <div key={i} className="relative">
              <Input
                placeholder={i === 0 ? 'e.g. AAPL' : i === 1 ? 'e.g. MSFT' : `Ticker ${i + 1}`}
                value={ticker}
                onChange={e => updateTicker(i, e.target.value)}
                className="w-[110px] pr-7 font-mono text-sm tracking-wide"
              />
              {tickers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTicker(i)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Remove ticker ${i + 1}`}
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Date Range
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              className="w-[148px]"
              value={formData.start}
              onChange={set('start')}
            />
            <span className="text-muted-foreground text-sm">–</span>
            <Input
              type="date"
              className="w-[148px]"
              value={formData.end}
              onChange={set('end')}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 w-[110px]">
          <Label htmlFor="entry" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Investment
          </Label>
          <Input
            id="entry"
            type="number"
            placeholder="$1 000"
            value={formData.entry}
            onChange={set('entry')}
          />
        </div>

        <div className="flex flex-col gap-1.5 w-[110px]">
          <Label htmlFor="reinvest_amount" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            DCA Amount
          </Label>
          <Input
            id="reinvest_amount"
            type="number"
            placeholder="$500"
            value={formData.reinvest_amount}
            onChange={set('reinvest_amount')}
          />
        </div>

        <div className="flex flex-col gap-1.5 w-[110px]">
          <Label htmlFor="interval" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Interval (days)
          </Label>
          <Input
            id="interval"
            type="number"
            placeholder="30"
            value={formData.reinvest_interval}
            onChange={set('reinvest_interval')}
          />
        </div>

        <div className="flex-1" />
        <Button
          type="submit"
          size="lg"
          className="gap-2 px-6 font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
          disabled={tickers.every(t => t.trim() === '')}
        >
          <Search className="size-4" />
          Analyze
        </Button>
      </div>
    </form>
  )
}
