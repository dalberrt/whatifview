import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Search, Plus, X } from "lucide-react"
import { getForm, setForm } from '@/utils/cache'

interface StockSearchFormProps {
  onSearch: (tickers: string[], p1: number, p2: number, entry: string, reinvest_amount: string, reinvest_interval: string) => void
}

// ── Validation ─────────────────────────────────────────────────────────────

interface FormErrors {
  tickers?: string
  start?: string
  end?: string
  entry?: string
  reinvest?: string
}

type FormData = { start: string; end: string; entry: string; reinvest_amount: string; reinvest_interval: string }

function validate(tickers: string[], fd: FormData): FormErrors {
  const errors: FormErrors = {}
  const active = tickers.filter(t => t.trim() !== '')

  if (active.length === 0)
    errors.tickers = 'Add at least one ticker.'

  if (!fd.start)
    errors.start = 'Start date required.'

  if (!fd.end) {
    errors.end = 'End date required.'
  } else if (fd.start) {
    const start = new Date(fd.start)
    const end   = new Date(fd.end)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    if (end <= start)      errors.end = 'Must be after start date.'
    else if (end > today)  errors.end = 'Cannot be in the future.'
  }

  const entryNum = Number(fd.entry)
  if (!fd.entry || entryNum <= 0)
    errors.entry = 'Investment must be greater than $0.'

  const dcaAmt = Number(fd.reinvest_amount)
  const dcaInt = Number(fd.reinvest_interval)
  if (fd.reinvest_amount && dcaAmt < 0) {
    errors.reinvest = 'DCA amount cannot be negative.'
  } else if (dcaAmt > 0 && (!fd.reinvest_interval || dcaInt < 1)) {
    errors.reinvest = 'Set an interval ≥ 1 day when using DCA.'
  } else if (fd.reinvest_interval && dcaInt < 1) {
    errors.reinvest = 'Interval must be ≥ 1 day.'
  }

  return errors
}

// ── Load saved form from localStorage ─────────────────────────────────────

function loadSaved(): { tickers: string[]; fd: FormData } {
  const saved = getForm()
  if (saved) {
    const { tickers, ...fd } = saved
    return { tickers: tickers.length >= 2 ? tickers : [...tickers, ''], fd }
  }
  return {
    tickers: ['', ''],
    fd: { start: '', end: '', entry: '', reinvest_amount: '', reinvest_interval: '' },
  }
}

// ── Component ──────────────────────────────────────────────────────────────

export function StockSearchForm({ onSearch }: StockSearchFormProps) {
  const saved = loadSaved()
  const [tickers, setTickers]   = useState<string[]>(saved.tickers)
  const [formData, setFormData] = useState<FormData>(saved.fd)
  const [errors, setErrors]     = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const updateTicker = (i: number, val: string) =>
    setTickers(prev => prev.map((t, idx) => idx === i ? val.toUpperCase() : t))

  const addTicker = () => setTickers(prev => [...prev, ''])

  const removeTicker = (i: number) =>
    setTickers(prev => prev.filter((_, idx) => idx !== i))

  const set = (key: keyof FormData) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const updated = { ...formData, [key]: e.target.value }
      setFormData(updated)
      if (submitted) setErrors(validate(tickers, updated))
    }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const active = tickers.filter(t => t.trim() !== '')
    const errs   = validate(tickers, formData)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    // Persist form state
    setForm({ tickers: active, ...formData })

    const p1 = Math.floor(new Date(formData.start).getTime() / 1000)
    const p2 = Math.floor(new Date(formData.end).getTime() / 1000)
    onSearch(active, p1, p2, formData.entry, formData.reinvest_amount, formData.reinvest_interval)
  }

  const err = (msg?: string) =>
    msg ? <p className="text-[11px] text-destructive mt-1">{msg}</p> : null

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-card shadow-sm overflow-hidden">

      {/* ── Tickers ── */}
      <div className="px-5 pt-5 pb-4 border-b">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">
          Tickers
        </Label>
        <div className="flex flex-wrap items-center gap-2">
          {tickers.map((ticker, i) => (
            <div key={i} className="group relative">
              <Input
                placeholder={i === 0 ? 'e.g. AAPL' : i === 1 ? 'e.g. MSFT' : `Ticker ${i + 1}`}
                value={ticker}
                onChange={e => {
                  updateTicker(i, e.target.value)
                  if (submitted) setErrors(v => ({ ...v, tickers: undefined }))
                }}
                className="w-[110px] font-mono text-sm tracking-wide pr-6"
              />
              {tickers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTicker(i)}
                  className="absolute right-0.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all p-0.5"
                  aria-label={`Remove ticker ${i + 1}`}
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTicker}
            className="flex items-center gap-1 h-9 px-3 rounded-md border border-dashed text-xs text-muted-foreground hover:text-foreground hover:border-border transition-colors"
          >
            <Plus className="size-3" />
            Add
          </button>
        </div>
        {err(errors.tickers)}
      </div>

      {/* ── Params row ── */}
      <div className="px-5 py-4 flex flex-wrap items-start gap-4">

        {/* Date range */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Date Range
          </Label>
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <Input
                type="date"
                className={`w-[148px] [&::-webkit-calendar-picker-indicator]:dark:invert ${errors.start ? 'border-destructive' : ''}`}
                value={formData.start}
                onChange={set('start')}
              />
              {err(errors.start)}
            </div>
            <span className="text-muted-foreground text-sm mt-0.5">–</span>
            <div className="flex flex-col">
              <Input
                type="date"
                className={`w-[148px] [&::-webkit-calendar-picker-indicator]:dark:invert ${errors.end ? 'border-destructive' : ''}`}
                value={formData.end}
                onChange={set('end')}
              />
              {err(errors.end)}
            </div>
          </div>
        </div>

        {/* Investment */}
        <div className="flex flex-col gap-1.5 w-[110px]">
          <Label htmlFor="entry" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Investment
          </Label>
          <Input
            id="entry"
            type="number"
            min="0.01"
            step="any"
            placeholder="$1 000"
            value={formData.entry}
            onChange={set('entry')}
            className={errors.entry ? 'border-destructive' : ''}
          />
          {err(errors.entry)}
        </div>

        {/* DCA amount */}
        <div className="flex flex-col gap-1.5 w-[110px]">
          <Label htmlFor="reinvest_amount" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            DCA Amount
          </Label>
          <Input
            id="reinvest_amount"
            type="number"
            min="0"
            step="any"
            placeholder="$500"
            value={formData.reinvest_amount}
            onChange={set('reinvest_amount')}
            className={errors.reinvest ? 'border-destructive' : ''}
          />
        </div>

        {/* DCA interval */}
        <div className="flex flex-col gap-1.5 w-[110px]">
          <Label htmlFor="interval" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Interval (days)
          </Label>
          <Input
            id="interval"
            type="number"
            min="1"
            step="1"
            placeholder="30"
            value={formData.reinvest_interval}
            onChange={set('reinvest_interval')}
            className={errors.reinvest ? 'border-destructive' : ''}
          />
          {err(errors.reinvest)}
        </div>

        <div className="flex-1" />

        <Button
          type="submit"
          size="lg"
          className="gap-2 px-6 font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 bg-primary hover:bg-primary/85 text-primary-foreground border-0 self-end"
          disabled={tickers.every(t => t.trim() === '')}
        >
          <Search className="size-4" />
          Analyze
        </Button>
      </div>
    </form>
  )
}
