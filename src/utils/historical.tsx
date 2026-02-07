// src/utils/historical.ts

async function fetchHistoricalData(ticker: string, p1: number, p2: number, entry: number) {

    try {
        const res = await fetch(`https://corsproxy.io/?https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&period1=${p1}&period2=${p2}`)
        const data = await res.json()
        const dates = data["chart"]["result"][0]["timestamp"]
        const prices = data["chart"]["result"][0]["indicators"]["adjclose"][0]["adjclose"]
        const init_price_mult = entry / prices[0]
        const chartData = dates.map((date, index) => ({
            date: new Date(date * 1000).toISOString().split('T')[0],
            desktop: init_price_mult * prices[index]
            }))
        return chartData
    } catch (err) {
        console.error("Fetch error:", err)
        return null
    }
}

export default fetchHistoricalData