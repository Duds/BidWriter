"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useProjectStore } from "@/lib/stores/project-store"
import { FileText, FileIcon as FilePresentation, FileSpreadsheet, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

type ProcessType = "proposal" | "deal" | "summary"

type ProcessStatus = {
  documentProcessing: number
  aiAnalysis: number
  finalAssembly: number
  overall: "idle" | "processing" | "success" | "error"
  message: string
}

export function ProcessingDashboard() {
  const { toast } = useToast()
  const { selectedProject } = useProjectStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentProcess, setCurrentProcess] = useState<ProcessType | null>(null)
  const [status, setStatus] = useState<ProcessStatus>({
    documentProcessing: 0,
    aiAnalysis: 0,
    finalAssembly: 0,
    overall: "idle",
    message: "Ready to process",
  })

  const startProcess = async (processType: ProcessType) => {
    if (!selectedProject) {
      toast({
        title: "No Project Selected",
        description: "Please select a project first",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setCurrentProcess(processType)
    setStatus({
      documentProcessing: 0,
      aiAnalysis: 0,
      finalAssembly: 0,
      overall: "processing",
      message: `Starting ${processType} generation...`,
    })

    try {
      // Set up event source for progress updates
      const eventSource = new EventSource(`/api/projects/${selectedProject}/process/${processType}`)

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)
        setStatus((prev) => ({
          ...prev,
          documentProcessing: data.documentProcessing || prev.documentProcessing,
          aiAnalysis: data.aiAnalysis || prev.aiAnalysis,
          finalAssembly: data.finalAssembly || prev.finalAssembly,
          message: data.message || prev.message,
        }))
      }

      eventSource.addEventListener("complete", (event) => {
        const data = JSON.parse(event.data)
        eventSource.close()
        setStatus((prev) => ({
          ...prev,
          documentProcessing: 100,
          aiAnalysis: 100,
          finalAssembly: 100,
          overall: "success",
          message: "Process completed successfully",
        }))

        toast({
          title: "Process Complete",
          description: `${processType.charAt(0).toUpperCase() + processType.slice(1)} generated successfully!`,
        })

        // Dispatch event to update output display
        window.dispatchEvent(
          new CustomEvent("processComplete", {
            detail: {
              type: processType,
              result: data.result,
            },
          }),
        )

        setIsProcessing(false)
      })

      eventSource.addEventListener("error", (event) => {
        eventSource.close()
        const data = event.data ? JSON.parse(event.data) : { error: "Unknown error occurred" }

        setStatus((prev) => ({
          ...prev,
          overall: "error",
          message: data.error || "Process failed",
        }))

        toast({
          title: "Process Failed",
          description: data.error || "An unknown error occurred",
          variant: "destructive",
        })

        setIsProcessing(false)
      })
    } catch (error) {
      console.error("Process error:", error)
      setStatus((prev) => ({
        ...prev,
        overall: "error",
        message: "Failed to start process",
      }))

      toast({
        title: "Error",
        description: "Failed to start the process",
        variant: "destructive",
      })

      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Document Generation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProgressCard
              title="Document Processing"
              progress={status.documentProcessing}
              isActive={isProcessing && status.documentProcessing < 100}
            />
            <ProgressCard
              title="AI Analysis"
              progress={status.aiAnalysis}
              isActive={isProcessing && status.aiAnalysis < 100 && status.documentProcessing === 100}
            />
            <ProgressCard
              title="Final Assembly"
              progress={status.finalAssembly}
              isActive={isProcessing && status.finalAssembly < 100 && status.aiAnalysis === 100}
            />
          </div>

          <div className="pt-2">
            <p className="text-sm text-center text-muted-foreground">{status.message}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              onClick={() => startProcess("proposal")}
              disabled={isProcessing || !selectedProject}
              className="h-auto py-3 px-4"
            >
              <div className="flex flex-col items-center gap-1">
                <FileText className="h-5 w-5" />
                <span>Generate Proposal</span>
              </div>
            </Button>
            <Button
              onClick={() => startProcess("deal")}
              disabled={isProcessing || !selectedProject}
              className="h-auto py-3 px-4"
            >
              <div className="flex flex-col items-center gap-1">
                <FilePresentation className="h-5 w-5" />
                <span>Generate Deal Approval</span>
              </div>
            </Button>
            <Button
              onClick={() => startProcess("summary")}
              disabled={isProcessing || !selectedProject}
              className="h-auto py-3 px-4"
            >
              <div className="flex flex-col items-center gap-1">
                <FileSpreadsheet className="h-5 w-5" />
                <span>Generate Summary</span>
              </div>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProgressCard({ title, progress, isActive }: { title: string; progress: number; isActive: boolean }) {
  return (
    <div className="bg-card rounded-lg border p-3">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">{title}</h4>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="relative h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "absolute top-0 left-0 h-full transition-all duration-500 ease-out rounded-full",
            isActive ? "progress-bar-animated" : "bg-primary",
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

