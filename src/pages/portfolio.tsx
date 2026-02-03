// src/pages/portfolio.tsx

import { useState, useEffect } from "react"
import { ChartLineLinear } from "@/components/ui/chart-line-linear"
import { ChartLineMultiple } from "@/components/ui/chart-line-multiple"
import { ChartLineInteractive } from "@/components/ui/chart-line-interactive"
import Dashboard from "@/components/ui/bridgeidkwhattonamethis"
import { StockSearchForm } from "@/components/ui/stock-search-form"
import fetchHistoricalData from "@/utils/historical"

function Portfolio() {
    return (
        <main>
            <h1>Portfolio</h1>
            {/*{loading ? (
                <p>Loading...</p>
            ) : (
                <pre className="w-full overflow-auto max-h-96 text-xs bg-gray-800 text-green-400 p-4 rounded">
                    {JSON.stringify(data, null, 2)}
                </pre>
            )}*/}
            <Dashboard />        
        </main>
    )
}

export default Portfolio