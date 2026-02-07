// src/utils/historical.ts

function sharesCalculator(prices: number[], entry: number, reinvest: number, dates: number[]) {

    let shares: Record<number, number> = {}
    let tempPrice = prices[0]
    let additionalShares = 0
    shares[0] = entry / tempPrice        //entry price divide by first stock price = get number of shares bought
    
    if (reinvest > 0) {
        for (let i = 1; i < dates.length; i++) {
            // each reinvest interval, buy more shares with reinvest amount
            if (i % reinvest === 0) {
                tempPrice = prices[i]       //price at that date
                additionalShares = entry / tempPrice
                console.log(" reinvest", reinvest, "price", tempPrice, "additionalShares", additionalShares)   //delete later
                shares[i] = (shares[i - 1] || 0) + additionalShares
            } else {
                shares[i] = shares[i - 1] || 0
            }
        }
    }
    else{
        // if no reinvestment, shares remain constant
        for (let i = 1; i < dates.length; i++) {
            shares[i] = shares[0]
        }
    }
    // console.log("reinvest", reinvest)   //delete later
    console.log("Shares dict:", shares)   //delete later

    return shares
}

async function fetchAPIDatesPrices(ticker: string, p1: number, p2: number) {
    const res = await fetch(`https://corsproxy.io/?https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&period1=${p1}&period2=${p2}`)
    const data = await res.json()
    const dates = data["chart"]["result"][0]["timestamp"]
    const prices = data["chart"]["result"][0]["indicators"]["adjclose"][0]["adjclose"]
    return { dates, prices }
}

async function fetchHistoricalData(ticker: string, p1: number, p2: number, entry: number, reinvest: number = 0, ticker2: string) {

    try {
        const { dates, prices } = await fetchAPIDatesPrices(ticker, p1, p2)
        let shares = sharesCalculator(prices, entry, reinvest, dates)
        
        const chartData = dates.map((date, index) => ({
            date: new Date(date * 1000).toISOString().split('T')[0],
            desktop: shares[index] * prices[index],
            }))

        if (ticker2) {
            const { dates: dates2, prices: prices2 } = await fetchAPIDatesPrices(ticker2, p1, p2)
            let shares2 = sharesCalculator(prices2, entry, reinvest, dates2)
            const init_price_mult2 = entry / prices2[0]
            const chartData = dates.map((date, index) => ({
                date: new Date(date * 1000).toISOString().split('T')[0],
                desktop: shares[index] * prices[index],
                mobile: shares2[index] * prices2[index]
                }))
            return chartData
        }
        return chartData
    } catch (err) {
        console.error("Fetch error:", err)
        return null
    }
}

export default fetchHistoricalData