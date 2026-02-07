import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react" 

export function StockSearchForm({onSearch}) {
    const [formData, setFormData] = useState({ ticker1: "", ticker2: "", start: "", end: "", entry: "", reinvest: ""});

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const p1 = Math.floor(new Date(formData.start).getTime() / 1000);
        const p2 = Math.floor(new Date(formData.end).getTime() / 1000);

        onSearch(formData.ticker1, formData.ticker2, p1, p2, formData.entry, formData.reinvest);
    }
    return(
        
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4 p-4 bg-muted/50 rounded-lg mb-6">
            <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
                <Label htmlFor="ticker" className="text-xs font-semibold uppercase text-muted-foreground">Ticker</Label>
                <Input 
                    id="ticker"
                    placeholder="e.g. AAPL" 
                    className="bg-background"
                    value={formData.ticker1}
                    onChange={(e) => setFormData({ ...formData, ticker1: e.target.value.toUpperCase() })} 
                />
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
                <Label htmlFor="ticker2" className="text-xs font-semibold uppercase text-muted-foreground">2nd Ticker</Label>
                <Input 
                    id="ticker2"
                    placeholder="optional" 
                    className="bg-background"
                    value={formData.ticker2}
                    onChange={(e) => setFormData({ ...formData, ticker2: e.target.value.toUpperCase() })} 
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Date Range</Label>
                <div className="flex items-center gap-2">
                <Input 
                    type="date" 
                    className="w-[150px] bg-background"
                    value={formData.start}
                    onChange={(e) => setFormData({ ...formData, start: e.target.value})}
                />
                <span className="text-muted-foreground">-</span>
                <Input 
                    type="date" 
                    className="w-[150px] bg-background"
                    value={formData.end}
                    onChange={(e) => setFormData({ ...formData, end: e.target.value})}
                />
                </div>
            </div>

            <div className="flex flex-col gap-1.5 w-[120px]">
                <Label htmlFor="entry" className="text-xs font-semibold uppercase text-muted-foreground">Investment</Label>
                <Input 
                    id="entry"
                    type="number"
                    placeholder="$1000"
                    className="bg-background"
                    value={formData.entry}
                    onChange={(e) => setFormData({ ...formData, entry: e.target.value})}
                />
            </div>
            <div className="flex flex-col gap-1.5 w-[120px]">
                <Label htmlFor="interval" className="text-xs font-semibold uppercase text-muted-foreground">Re-Investment Interval (days)</Label>
                <Input 
                    id="interval"
                    type="number"
                    placeholder="30"
                    className="bg-background"
                    value={formData.reinvest}
                    onChange={(e) => setFormData({ ...formData, reinvest: e.target.value})}
                />
            </div>

            <Button type="submit" className="px-6 text-blue-500">
                <Search className="w-4 h-4 mr-2 text-blue-500" />
                Analyze
            </Button>
        </form>
    )
}