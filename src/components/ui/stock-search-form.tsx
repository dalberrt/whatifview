import { useState } from 'react'

export function StockSearchForm({onSearch}) {
    const [formData, setFormData] = useState({ ticker: "", start: "", end: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const p1 = Math.floor(new Date(formData.start).getTime() / 1000);
        const p2 = Math.floor(new Date(formData.end).getTime() / 1000);

        onSearch(formData.ticker, p1, p2);
    }
    return(
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                placeholder="Enter Ticker"
                value={formData.ticker} 
                onChange={(e) => setFormData({ ...formData, ticker: e.target.value })} 
            />
            <label>Enter Start Date: </label>
            <input 
                type="date"
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value})}
            />
            <label>Enter End Date: </label>
            <input 
                type="date"
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value})}
            />
            <button type="submit">Search</button>
        </form>
        
    )
}