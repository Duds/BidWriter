"use client"

import { useState } from "react"
import { FileText, FileIcon, Clock, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

type ActivityItem = {
  id: string
  type: "document_created" | "template_added" | "project_created" | "process_completed" | "process_failed"
  title: string
  description: string
  timestamp: string
  status?: "success" | "error" | "pending"
}

export function RecentActivity() {
  const [activities] = useState<ActivityItem[]>([
    {
      id: "act1",
      type: "document_created",
      title: "Proposal Generated",
      description: "Bid_Proposal_2023-04-06.docx",
      timestamp: "10 minutes ago",
      status: "success",
    },
    {
      id: "act2",
      type: "template_added",
      title: "Template Added",
      description: "Deal_approval_Template.pptx",
      timestamp: "2 hours ago",
    },
    {
      id: "act3",
      type: "process_failed",
      title: "Process Failed",
      description: "Summary generation failed",
      timestamp: "Yesterday",
      status: "error",
    },
    {
      id: "act4",
      type: "project_created",
      title: "Project Created",
      description: "Cloud Migration Project",
      timestamp: "2 days ago",
    },
    {
      id: "act5",
      type: "process_completed",
      title: "Deal Approval Generated",
      description: "Deal_Approval_2023-04-04.pptx",
      timestamp: "3 days ago",
      status: "success",
    },
  ])

  const getActivityIcon = (type: string, status?: string) => {
    switch (type) {
      case "document_created":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "template_added":
        return <FileIcon className="h-4 w-4 text-purple-500" />
      case "project_created":
        return <FileIcon className="h-4 w-4 text-green-500" />
      case "process_completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "process_failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Recent Activity</h3>
        <button className="text-xs text-primary flex items-center gap-1">
          <RefreshCw className="h-3 w-3" />
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3 items-start p-2 rounded-md hover:bg-muted/50 transition-colors">
            <div className="mt-0.5">{getActivityIcon(activity.type, activity.status)}</div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{activity.title}</p>
                <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
              </div>
              <p className="text-xs text-muted-foreground">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

