import { FileText } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white p-6 shadow-lg border-b border-blue-950">
      <div className="container mx-auto flex items-center gap-3">
        <div className="bg-white p-2 rounded-lg shadow-md">
          <FileText className="h-8 w-8 text-blue-800" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">BidWriter</h1>
          <p className="text-blue-100 mt-1 text-sm">AI-Powered Proposal Generation Platform</p>
        </div>
      </div>
    </header>
  )
}

