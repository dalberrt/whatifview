import { Button } from "@/components/ui/button"
import { ChartLineLinear } from "@/components/ui/chart-line-linear"
import { ChartLineMultiple } from "@/components/ui/chart-line-multiple"

function Portfolio() {
    return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8">
        <Button>Hi there!</Button>
        <ChartLineLinear />
        <ChartLineMultiple />
    </main>
    )
}
export default Portfolio;