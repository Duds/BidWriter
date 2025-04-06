"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Caught error:", error)
      setError(error.error)
      setHasError(true)
    }

    window.addEventListener("error", errorHandler)
    return () => window.removeEventListener("error", errorHandler)
  }, [])

  if (hasError) {
    if (fallback) return <>{fallback}</>

    return (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 text-red-900">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5" />
          <h3 className="font-medium">Something went wrong</h3>
        </div>
        <p className="text-sm mb-4">{error?.message || "An unexpected error occurred"}</p>
        <Button size="sm" variant="outline" onClick={() => window.location.reload()} className="bg-white">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reload page
        </Button>
      </div>
    )
  }

  return <>{children}</>
}

