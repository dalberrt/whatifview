// src/utils/historical.ts

function sharesCalculator(prices: number[], entry: number, reinvest: number, dates: number[]) {

    let shares: Record<number, number> = {}
    let tempPrice = prices[0]
    let additionalShares = 0
    shares[dates[0]] = entry / tempPrice        // dictionary becomes --> date_string: shares_owned
    
    if (reinvest > 0) {
        for (let i = 1; i < dates.length; i++) {
            // each reinvest interval, buy more shares with reinvest amount
            if (i % reinvest === 0) {
                tempPrice = prices[i]       //price at that date
                additionalShares = entry / tempPrice
                // console.log(" reinvest", reinvest, "price", tempPrice, "additionalShares", additionalShares)   //delete later
                shares[dates[i]] = (shares[dates[i - 1]] || 0) + additionalShares
            } else {
                shares[dates[i]] = shares[dates[i - 1]] || 0
            }
        }
    }
    else{
        // if no reinvestment, shares remain constant
        for (let i = 1; i < dates.length; i++) {
            shares[dates[i]] = shares[dates[0]]
        }
    }

    return shares
}

function dummyDataFill(tickers: string[], tickerShares: Record<string, Record<number, number>>, tickerPrices: Record<string, Record<number, number>>, tickerDates: Record<string, Record<number, number>>) {
    //FILL IN 0 for dates before IPO of a stock
    // first we nid find ticker with earliest start date
    // then for each ticker, fill in 0 shares and 0 price for dates before its first date


    //compare first date of tickers, find earliest
    // ok nvm maybe we dont even need this but may need it later if we make a portfolio line chart (combine all stocks into 1 line chart)
    let earliestDate = Infinity
    let earliestTicker = ""
    for (let t of tickers) {
        let firstDate = tickerDates[t][0]
        if (firstDate < earliestDate) {
            earliestDate = firstDate
            earliestTicker = t
        }
    }
    console.log(earliestTicker)
    return earliestTicker
}

async function fetchAPIDatesPrices(ticker: string, p1: number, p2: number) {
    const res = await fetch(`https://corsproxy.io/?https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&period1=${p1}&period2=${p2}`)
    const data = await res.json()
    const dates = data["chart"]["result"][0]["timestamp"]
    // console.log("Dates from API for", ticker, dates)   //delete later
    const prices = data["chart"]["result"][0]["indicators"]["adjclose"][0]["adjclose"]
    return { dates, prices }
}


async function fetchHistoricalData(tickers: string[], p1: number, p2: number, entry: number, reinvest: number = 0) {

    try {
        let tickerDates: Record<string, Record<number, number>> = {}
        let tickerPrices: Record<string, Record<number, number>> = {}
        let tickerShares: Record<string, Record<number, number>> = {}
        

        for (let t of tickers) {
            if (t){
                const { dates, prices } = await fetchAPIDatesPrices(t, p1, p2)

                let shares = sharesCalculator(prices, entry, reinvest, dates)
                tickerDates[t] = dates
                tickerShares[t] = shares
                tickerPrices[t] = {}

                for (let i = 0; i < prices.length; i++) {
                    tickerPrices[t][dates[i]] = prices[i]
                }
            }
            //console.log("tickerdates", tickerDates)
            //console.log("tickerprices", tickerPrices)
            //console.log("tickershares", tickerShares)

        }
        let earliestTicker = dummyDataFill(tickers, tickerShares, tickerPrices, tickerDates)

        const chartData = tickerDates[earliestTicker].map((date, index) => ({
            date: new Date(date * 1000).toISOString().split('T')[0],
            desktop: tickerShares[tickers[0]][date] * tickerPrices[tickers[0]][date],             //value = shares * price
            mobile: tickers[1] ? tickerShares[tickers[1]][date] * tickerPrices[tickers[1]][date] : null,  //if 2nd ticker exists, calculate its value oso
            car: 1000 + index * 10  //dummy data for car,
            }))
        
        
        return chartData

    } catch (err) {
        console.error("Fetch error:", err)
        return null
    }
}

export default fetchHistoricalData