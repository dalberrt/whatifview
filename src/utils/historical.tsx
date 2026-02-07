// src/utils/historical.ts

async function fetchHistoricalData(ticker: string, p1: number, p2: number, entry: number, reinvest: number = 0, ticker2: string) {

    try {
        console.log(ticker2)
        if (ticker2) {
            console.log("hi")
            const res2 = await fetch(`https://corsproxy.io/?https://query2.finance.yahoo.com/v8/finance/chart/${ticker2}?interval=1d&period1=${p1}&period2=${p2}`)
            const data2 = await res2.json()
            const prices2 = data2["chart"]["result"][0]["indicators"]["adjclose"][0]["adjclose"]
            const init_price_mult2 = entry / prices2[0]
        }
        const res = await fetch(`https://corsproxy.io/?https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&period1=${p1}&period2=${p2}`)
        const data = await res.json()
        const dates = data["chart"]["result"][0]["timestamp"]
        const prices = data["chart"]["result"][0]["indicators"]["adjclose"][0]["adjclose"]
        const init_price_mult = entry / prices[0]
        // get first date from first date of json (in case user pick date before ipo)
        // make list of number of stock owned, instead of price
        // each interval add to number of stock owned based on price at that date
        // at the end multiply number of stock owned by price at each date to get value over time
        const chartData = dates.map((date, index) => ({
            date: new Date(date * 1000).toISOString().split('T')[0],
            desktop: init_price_mult * prices[index],
            ...(ticker2 && {mobile: init_price_mult2 * prices2[index]})
            }))
        return chartData
    } catch (err) {
        console.error("Fetch error:", err)
        return null
    }
}

export default fetchHistoricalData