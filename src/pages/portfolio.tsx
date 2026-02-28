import Dashboard from "@/components/process/data2chart-bridge"

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