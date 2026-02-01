import { ChartLineLinear } from "@/components/ui/chart-line-linear"
import { ChartLineMultiple } from "@/components/ui/chart-line-multiple"

function Portfolio() {
    return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8">
        <h1>Portfolio</h1>
        <ChartLineLinear />
        <ChartLineMultiple />
    </main>
    )
}
export default Portfolio;