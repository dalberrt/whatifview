// src/pages/portfolio.tsx

import { useState, useEffect } from "react"
import { ChartLineLinear } from "@/components/ui/chart-line-linear"
import { ChartLineMultiple } from "@/components/ui/chart-line-multiple"
import { ChartLineInteractive } from "@/components/ui/chart-line-interactive"
import fetchHistoricalData from "@/utils/historical"

function Portfolio() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchHistoricalData().then((json) => {
            setData(json)
            setLoading(false)
        })
    }, [])

    return (
        <main>
            <h1>Portfolio</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <pre className="w-full overflow-auto max-h-96 text-xs bg-gray-800 text-green-400 p-4 rounded">
                    {JSON.stringify(data, null, 2)}
                </pre>
            )}
            <ChartLineLinear />
            
        </main>
    )
}

export default Portfolio