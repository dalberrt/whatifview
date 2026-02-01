// src/pages/portfolio.tsx

import { useState, useEffect } from "react"
import { ChartLineLinear } from "@/components/ui/chart-line-linear"
import { ChartLineMultiple } from "@/components/ui/chart-line-multiple"
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
        <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8">
            <h1>Portfolio</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <pre className="w-full overflow-auto max-h-96 text-xs bg-gray-800 text-green-400 p-4 rounded">
                    {JSON.stringify(data, null, 2)}
                </pre>
            )}
            <ChartLineLinear />
            <ChartLineMultiple />
        </main>
    )
}

export default Portfolio