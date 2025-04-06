"use client"

export function BarChart() {
  return (
    <div className="h-[300px] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="flex items-end h-[250px] gap-2">
          <div className="flex-1 flex flex-col items-center">
            <div className="bg-blue-500 w-full rounded-t-md" style={{ height: "60%" }}></div>
            <span className="text-xs mt-2 text-muted-foreground">Proposals</span>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="bg-green-500 w-full rounded-t-md" style={{ height: "30%" }}></div>
            <span className="text-xs mt-2 text-muted-foreground">Summaries</span>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="bg-orange-500 w-full rounded-t-md" style={{ height: "45%" }}></div>
            <span className="text-xs mt-2 text-muted-foreground">Deals</span>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="bg-purple-500 w-full rounded-t-md" style={{ height: "20%" }}></div>
            <span className="text-xs mt-2 text-muted-foreground">Other</span>
          </div>
        </div>
      </div>
    </div>
  )
}

