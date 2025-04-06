"use client"

import { useEffect, useState } from "react"
import { useProjectStore } from "@/lib/stores/project-store"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

type StatusItem = {
  name: string
  status: "success" | "error" | "warning" | "pending"
  message: string
  percentage?: number
}

export function StatusPanel() {
  const { selectedProject } = useProjectStore()
  const [statuses, setStatuses] = useState<StatusItem[]>([
    { name: "System", status: "success", message: "Connected to server", percentage: 100 },
    { name: "OpenAI API", status: "pending", message: "Checking connection...", percentage: 0 },
    { name: "Templates", status: "pending", message: "Waiting for project selection...", percentage: 0 },
  ])

  useEffect(() => {
    if (!selectedProject) return

    const checkStatuses = async () => {
      try {
        // Update OpenAI status to checking
        setStatuses((prev) =>
          prev.map((item) =>
            item.name === "OpenAI API"
              ? { ...item, status: "pending", message: "Checking connection...", percentage: 50 }
              : item,
          ),
        )

        // Check OpenAI API status
        const apiResponse = await fetch("/api/check-openai")
        const apiData = await apiResponse.json()

        // Update OpenAI status based on response
        setStatuses((prev) =>
          prev.map((item) =>
            item.name === "OpenAI API"
              ? {
                  ...item,
                  status: apiData.available ? "success" : "error",
                  message: apiData.available ? "Connected" : "API key missing or invalid",
                  percentage: apiData.available ? 100 : 0,
                }
              : item,
          ),
        )

        // Update Templates status to checking
        setStatuses((prev) =>
          prev.map((item) =>
            item.name === "Templates"
              ? { ...item, status: "pending", message: "Checking templates...", percentage: 50 }
              : item,
          ),
        )

        // Check templates status
        const templatesResponse = await fetch(`/api/projects/${selectedProject}/templates`)
        const templatesData = await templatesResponse.json()

        // Update Templates status based on response
        setStatuses((prev) =>
          prev.map((item) =>
            item.name === "Templates"
              ? {
                  ...item,
                  status: templatesData.available ? "success" : "warning",
                  message: templatesData.available ? `${templatesData.count} templates found` : "No templates found",
                  percentage: templatesData.available ? 100 : 70,
                }
              : item,
          ),
        )
      } catch (error) {
        console.error("Failed to check statuses:", error)

        // Update statuses to error state
        setStatuses((prev) =>
          prev.map((item) =>
            item.name !== "System" ? { ...item, status: "error", message: "Connection failed", percentage: 0 } : item,
          ),
        )
      }
    }

    checkStatuses()
  }, [selectedProject])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      default:
        return <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
    }
  }

  return (
    <div className="space-y-3">
      {statuses.map((item) => (
        <div key={item.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(item.status)}
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">{item.message}</span>
          </div>
          <Progress
            value={item.percentage}
            className={cn(
              "h-1.5",
              item.status === "success" && "bg-muted",
              item.status === "error" && "bg-red-100 dark:bg-red-950",
              item.status === "warning" && "bg-amber-100 dark:bg-amber-950",
              item.status === "pending" && "bg-muted",
            )}
          />
        </div>
      ))}
    </div>
  )
}

