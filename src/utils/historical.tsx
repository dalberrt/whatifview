// src/utils/historical.ts

async function fetchHistoricalData() {
    try {
        const res = await fetch('https://corsproxy.io/?https://query2.finance.yahoo.com/v8/finance/chart/AAPL?interval=1mo&range=1y')
        const data = await res.json()
        console.log(data)
        return data
    } catch (err) {
        console.error("Fetch error:", err)
        return null
    }
}

export default fetchHistoricalData