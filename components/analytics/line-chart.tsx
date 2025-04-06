"use client"

export function LineChart() {
  return (
    <div className="h-[300px] flex items-center justify-center">
      <div className="w-full max-w-md">
        <svg viewBox="0 0 300 100" className="w-full h-full">
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-blue-500"
            points="0,80 50,70 100,40 150,30 200,50 250,20 300,30"
          />
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-green-500"
            points="0,90 50,85 100,60 150,65 200,60 250,50 300,40"
          />
          <g className="text-muted-foreground text-xs">
            <text x="0" y="100">
              Jan
            </text>
            <text x="50" y="100">
              Feb
            </text>
            <text x="100" y="100">
              Mar
            </text>
            <text x="150" y="100">
              Apr
            </text>
            <text x="200" y="100">
              May
            </text>
            <text x="250" y="100">
              Jun
            </text>
          </g>
        </svg>
      </div>
    </div>
  )
}

