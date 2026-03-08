// Simple localStorage cache with TTL

const PRICE_TTL  = 24 * 60 * 60 * 1000   // 24 h  — historical prices don't change
const SESSION_KEY = 'whatif_session'
const FORM_KEY    = 'whatif_form'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

function get<T>(key: string, ttl: number): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const entry: CacheEntry<T> = JSON.parse(raw)
    if (Date.now() - entry.timestamp > ttl) {
      localStorage.removeItem(key)
      return null
    }
    return entry.data
  } catch {
    return null
  }
}

function set<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }))
  } catch {
    // localStorage full or unavailable — silently skip
  }
}

//Price cache (per ticker + date range)

export function getPriceCache(ticker: string, p1: number, p2: number) {
  return get<{ dates: number[]; prices: number[] }>(
    `whatif_prices_${ticker}_${p1}_${p2}`,
    PRICE_TTL
  )
}

export function setPriceCache(ticker: string, p1: number, p2: number, data: { dates: number[]; prices: number[] }) {
  set(`whatif_prices_${ticker}_${p1}_${p2}`, data)
}

//Last session (chart + analytics results)

export interface SessionData {
  chartData: any
  analyticsData: any
  symbols: string[]
}

export function getSession(): SessionData | null {
  return get<SessionData>(SESSION_KEY, Infinity)
}

export function setSession(data: SessionData): void {
  set(SESSION_KEY, data)
}

//Last form state

export interface FormState {
  tickers: string[]
  start: string
  end: string
  entry: string
  reinvest_amount: string
  reinvest_interval: string
}

export function getForm(): FormState | null {
  return get<FormState>(FORM_KEY, Infinity)
}

export function setForm(data: FormState): void {
  set(FORM_KEY, data)
}
