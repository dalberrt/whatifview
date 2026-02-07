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
                // console.log(" reinvest", reinvest, "price", tempPrice, "additionalShares", additionalShares)   //delete later
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
    // console.log("Shares dict:", shares)   //delete later

    return shares
}

async function fetchAPIDatesPrices(ticker: string, p1: number, p2: number) {
    const res = await fetch(`https://corsproxy.io/?https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&period1=${p1}&period2=${p2}`)
    const data = await res.json()
    const dates = data["chart"]["result"][0]["timestamp"]
    const prices = data["chart"]["result"][0]["indicators"]["adjclose"][0]["adjclose"]
    return { dates, prices }
}


async function fetchHistoricalData(tickers: string[], p1: number, p2: number, entry: number, reinvest: number = 0) {

    try {
        let tickerDates: Record<string, number[]> = {}
        let tickerPrices: Record<string, number[]> = {}
        let tickerShares: Record<string, Record<number, number>> = {}
        

        for (let t of tickers) {
            if (t){
                const { dates, prices } = await fetchAPIDatesPrices(t, p1, p2)
                // console.log("ticker", t, "dates", dates) delet pls
                let shares = sharesCalculator(prices, entry, reinvest, dates)
                tickerDates[t] = dates
                tickerShares[t] = shares
                tickerPrices[t] = prices
            }
            console.log("tickerdates", tickerDates)
            console.log("tickerprices", tickerPrices)
            console.log("tickershares", tickerShares)

        }
        // console.log("Ticker Shares:", tickerShares)   //delete later
        // console.log("Ticker Prices:", tickerPrices)   //delete later
        
        // for now we use 1 ticker cause idk how use multiple to put into same chart
        const chartData = tickerDates[tickers[0]].map((date, index) => ({
            date: new Date(date * 1000).toISOString().split('T')[0],
            desktop: tickerShares[tickers[0]][index] * tickerPrices[tickers[0]][index],
            mobile: tickers[1] ? tickerShares[tickers[1]][index] * tickerPrices[tickers[1]][index] : null,
            car: 1000 + index * 10  //dummy data for car,
            }))
        
        
        return chartData

    } catch (err) {
        console.error("Fetch error:", err)
        return null
    }
}

export default fetchHistoricalData