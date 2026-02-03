// src/utils/historical.ts

async function fetchHistoricalData(ticker: string, p1: number, p2: number) {

    try {
        const res = await fetch(`https://corsproxy.io/?https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&period1=${p1}&period2=${p2}`)
        //https://corsproxy.io/?https://query2.finance.yahoo.com/v8/finance/chart/[TICKR]?interval=1d&period1=[START_TIMESTAMP]&period2=[END_TIMESTAMP]
        // FOR NOW: user gives me TICKER, START DATE, END DATE
        
        const data = await res.json()
        console.log(data)
        //data["chart"]["result"][0]["meta"]["symbol"]
        //data["chart"]["result"][0]["indicators"]["adjclose"][0]["adjclose"][]
        //data["chart"]["result"][0]["timestamp"][]
        const dates = data["chart"]["result"][0]["timestamp"]
        const prices = data["chart"]["result"][0]["indicators"]["adjclose"][0]["adjclose"]
        const chartData = dates.map((date, index) => ({
            date: new Date(date * 1000).toISOString().split('T')[0],
            desktop: prices[index]
            }))
        return chartData
    } catch (err) {
        console.error("Fetch error:", err)
        return null
    }
}

export default fetchHistoricalData