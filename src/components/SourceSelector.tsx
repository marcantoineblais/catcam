import { Monitor } from "@/src/models/monitor";

export default function SourceSelector(
    { monitors, selectedMonitor, setSelectedMonitor }: 
    { monitors?: Monitor[], selectedMonitor?: Monitor, setSelectedMonitor: Function }
) {

    function renderButtons() {
        if (monitors)
            return monitors.map((monitor, i) => {
                const isActive = selectedMonitor?.mid === monitor.mid
                
                return (
                    <button
                        className="w-full md:w-48 h-12 bg-gradient-to-t from-gray-900 to-sky-700 text-white rounded shadow shadow-gray-900/50 dark:shadow-zinc-50/50 duration-200 hover:brightness-125 disabled:cursor-default disabled:brightness-75"
                        onClick={() => setSelectedMonitor(monitor)} 
                        key={i}
                        disabled={isActive}
                    >
                        {monitor.name}
                    </button>
                )
            })
    }

    return (
        <div className="py-3 w-full h-full flex flex-wrap content-start justify-center gap-1.5">
            {renderButtons()}
        </div>
    )
}