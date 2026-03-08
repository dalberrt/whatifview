import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { ticker, period1, period2 } = req.query

  if (!ticker || !period1 || !period2) {
    return res.status(400).json({ error: 'Missing required parameters' })
  }

  try {
    const url = `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&period1=${period1}&period2=${period2}`
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    })

    if (!response.ok) {
      const body = await response.text()
      return res.status(response.status).json({ error: `Yahoo API returned ${response.status}`, detail: body })
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    console.error('Yahoo API error:', error)
    return res.status(500).json({ error: String(error) })
  }
}
