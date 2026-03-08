import Dashboard from "@/components/process/data2chart-bridge"
import { AvatarGroupUs } from "@/components/ui/avatargroup"

function Portfolio() {
    return (
        <main>
            <h1 className="text-2xl font-bold tracking-tight mb-6">Portfolio</h1>
            {/*{loading ? (
                <p>Loading...</p>
            ) : (
                <pre className="w-full overflow-auto max-h-96 text-xs bg-gray-800 text-green-400 p-4 rounded">
                    {JSON.stringify(data, null, 2)}
                </pre>
            )}*/}
            <Dashboard />
            <div className="mt-10 flex justify-center">
                <AvatarGroupUs />
            </div>
        </main>
    )
}

export default Portfolio