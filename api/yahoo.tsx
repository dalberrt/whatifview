import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {

  // CORS my nightmare
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
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Yahoo API returned ${response.status}`)
    }
    
    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    console.error('Yahoo API error:', error)
    return res.status(500).json({ error: 'Failed to fetch data from Yahoo Finance' })
  }
}