// src/utils/historical.ts

function sharesCalculator(prices: number[], entry: number, reinvest_amount: number, reinvest_interval: number, dates: number[]) {

    let shares: Record<number, number> = {}
    let tempPrice = prices[0]
    let additionalShares = 0

    let total_invested_amount : number = Number(entry)
    let reinvestNum : number = Number(reinvest_amount)

    shares[dates[0]] = entry / tempPrice        // dictionary becomes --> date_string: shares_owned
    
    if (reinvest_interval > 0) {
        for (let i = 1; i < dates.length; i++) {
            // each reinvest interval, buy more shares with reinvest amount
            if (i % reinvest_interval === 0) {
                tempPrice = prices[i]       //price at that date
                additionalShares = reinvestNum / tempPrice
                total_invested_amount += reinvestNum
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
    //console.log("total_invested_amount", total_invested_amount)
    return {shares, total_invested_amount}
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
    return earliestTicker
}

function calculateAnalytics(shares_held: number, last_price: number, total_invested: number) {

    let ticker_data: Record<string, number> = {}
    ticker_data = {"total_invested": total_invested}
    ticker_data["last_price"] = last_price
    ticker_data["shares_held"] = shares_held

    const returns = (shares_held * last_price) - total_invested
    const percentage_returns = returns / total_invested * 100
    ticker_data["returns"] = returns
    ticker_data["percentage_returns"] = percentage_returns

    return ticker_data
}

async function fetchAPIDatesPrices(ticker: string, p1: number, p2: number) {
    const res = await fetch(`https://corsproxy.io/?https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&period1=${p1}&period2=${p2}`)
    const data = await res.json()
    const timestamps = data["chart"]["result"][0]["timestamp"]
    const prices = data["chart"]["result"][0]["indicators"]["adjclose"][0]["adjclose"]

    // Normalize timestamps to midnight UTC (start of day) cause of different timezonez when pulling different stock exchanges data
    const dates = timestamps.map((ts: number) => {
        const date = new Date(ts * 1000)
        date.setUTCHours(0, 0, 0, 0)
        return Math.floor(date.getTime() / 1000)
    })

    console.log("Dates from API for", ticker, dates)   //delete later
    //console.log("Prices from API for", ticker, prices)   //delete later

    return { dates, prices }
}

async function fetchHistoricalData(tickers: string[], p1: number, p2: number, entry: number, reinvest_amount: number = 0, reinvest_interval: number = 0) {

    try {
        let tickerDates: Record<string, Record<number, number>> = {}
        let tickerPrices: Record<string, Record<number, number>> = {}
        let tickerShares: Record<string, Record<number, number>> = {}
        
        let analyticsData: Record<string, any> = {}   //{ticker: {shares_held: x, total_invested: y, last_price: z, returns: r, percentage_returns: p}}

        for (let t of tickers) {
            if (t){
                const { dates, prices } = await fetchAPIDatesPrices(t, p1, p2)

                let { shares, total_invested_amount } = sharesCalculator(prices, entry, reinvest_amount, reinvest_interval, dates)
                tickerDates[t] = dates
                tickerShares[t] = shares
                tickerPrices[t] = {}

                for (let i = 0; i < prices.length; i++) {
                    tickerPrices[t][dates[i]] = prices[i]
                }
                analyticsData[t] = calculateAnalytics(shares[dates[dates.length - 1]], prices[prices.length - 1], total_invested_amount)

            }
            //console.log("tickerdates", tickerDates)
            //console.log("tickerprices", tickerPrices)
            //console.log("tickershares", tickerShares)

        }
        console.log(analyticsData)
        let earliestTicker = dummyDataFill(tickers, tickerShares, tickerPrices, tickerDates)

        /*const chartData = tickerDates[earliestTicker].map((date, index) => ({
            date: new Date(date * 1000).toISOString().split('T')[0],
            [tickers[0]]: tickerShares[tickers[0]][date] * tickerPrices[tickers[0]][date],             //value = shares * price
            [tickers[1]]: tickers[1] ? tickerShares[tickers[1]][date] * tickerPrices[tickers[1]][date] : null,  //if 2nd ticker exists, calculate its value oso
            car: 1000 + index * 10  //dummy data for car,
            }))*/

        const chartData = tickerDates[earliestTicker].map((date, index) => {
            const entry = {
                date: new Date(date * 1000).toISOString().split('T')[0],
                [tickers[0]]: tickerShares[tickers[0]][date] * tickerPrices[tickers[0]][date], 
                car: 1000 + index * 10  //dummy data for car,
            };

            if (tickers[1]) {
                for (let i = 0; i < tickers.length; i++) {
                    entry[tickers[i]] = tickerShares[tickers[i]][date] * tickerPrices[tickers[i]][date]
                }
                
            }

            return entry;
            });
        
        return chartData

    } catch (err) {
        console.error("Fetch error:", err)
        return null
    }
}

export default fetchHistoricalData