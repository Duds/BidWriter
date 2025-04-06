"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useProjectStore } from "@/lib/stores/project-store"
import {
  Download,
  ExternalLink,
  Clock,
  FileText,
  FileIcon as FilePresentation,
  FileSpreadsheet,
  Inbox,
  AlertCircle,
  RefreshCw,
  Cloud,
  Search,
  Filter,
} from "lucide-react"
import { EmptyState } from "./empty-state"
import { ErrorBoundary } from "./error-boundary"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type OutputFile = {
  id: string
  name: string
  type: "proposal" | "deal" | "summary"
  path: string
  createdAt: string
  size: number
}

interface OutputDisplayProps {
  limit?: number
}

export function OutputDisplay({ limit }: OutputDisplayProps) {
  const { selectedProject } = useProjectStore()
  const { toast } = useToast()
  const [outputs, setOutputs] = useState<OutputFile[]>([])
  const [filteredOutputs, setFilteredOutputs] = useState<OutputFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<OutputFile | null>(null)
  const [selectedStorage, setSelectedStorage] = useState<string>("google-drive")
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  useEffect(() => {
    if (!selectedProject) return

    const fetchOutputs = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`/api/projects/${selectedProject}/outputs`)

        if (!response.ok) {
          throw new Error(`Failed to fetch outputs: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.outputs) {
          setOutputs(data.outputs)
          setFilteredOutputs(data.outputs)
        }
      } catch (error) {
        console.error("Failed to fetch outputs:", error)
        setError(error instanceof Error ? error.message : "Failed to load outputs")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOutputs()

    // Listen for new outputs
    const handleProcessComplete = (event: CustomEvent) => {
      if (event.detail?.result) {
        const newOutput = event.detail.result
        setOutputs((prev) => [newOutput, ...prev])
        setFilteredOutputs((prev) => {
          const updated = [newOutput, ...prev]
          return applyFilters(updated, searchQuery, typeFilter)
        })
      }
    }

    window.addEventListener("processComplete", handleProcessComplete as EventListener)

    return () => {
      window.removeEventListener("processComplete", handleProcessComplete as EventListener)
    }
  }, [selectedProject])

  // Apply filters when search query or type filter changes
  useEffect(() => {
    setFilteredOutputs(applyFilters(outputs, searchQuery, typeFilter))
  }, [searchQuery, typeFilter, outputs])

  const applyFilters = (items: OutputFile[], query: string, type: string) => {
    return items.filter((item) => {
      const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase())
      const matchesType = type === "all" || item.type === type
      return matchesQuery && matchesType
    })
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "proposal":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "deal":
        return <FilePresentation className="h-5 w-5 text-orange-500" />
      case "summary":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleRetry = () => {
    if (!selectedProject) return

    // Re-fetch outputs
    setIsLoading(true)
    setError(null)

    fetch(`/api/projects/${selectedProject}/outputs`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch outputs")
        return response.json()
      })
      .then((data) => {
        if (data.outputs) {
          setOutputs(data.outputs)
          setFilteredOutputs(applyFilters(data.outputs, searchQuery, typeFilter))
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load outputs")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleSaveToCloud = (file: OutputFile) => {
    setSelectedFile(file)
    setSaveDialogOpen(true)
  }

  const handleSaveConfirm = () => {
    if (!selectedFile) return

    // In a real implementation, this would upload the file to the selected cloud storage
    toast({
      title: "File saved to cloud",
      description: `${selectedFile.name} has been saved to ${
        selectedStorage === "google-drive"
          ? "Google Drive"
          : selectedStorage === "onedrive"
            ? "Microsoft OneDrive"
            : "Dropbox"
      }`,
    })

    setSaveDialogOpen(false)
    setSelectedFile(null)
  }

  // Limit the number of outputs if specified
  const displayedOutputs = limit ? filteredOutputs.slice(0, limit) : filteredOutputs

  return (
    <ErrorBoundary>
      {!limit && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span>
                  {typeFilter === "all"
                    ? "All Types"
                    : typeFilter === "proposal"
                      ? "Proposals"
                      : typeFilter === "deal"
                        ? "Deal Approvals"
                        : "Summaries"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTypeFilter("all")}>All Types</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("proposal")}>Proposals</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("deal")}>Deal Approvals</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("summary")}>Summaries</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading documents...</p>
          </div>
        </div>
      ) : error ? (
        <div className="p-4 rounded-md bg-destructive/10 border border-destructive/20 text-destructive">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4" />
            <p className="font-medium">Error loading documents</p>
          </div>
          <p className="text-sm mb-3">{error}</p>
          <Button size="sm" variant="outline" onClick={handleRetry}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Try again
          </Button>
        </div>
      ) : displayedOutputs.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-6 w-6" />}
          title="No documents found"
          description={
            searchQuery || typeFilter !== "all"
              ? "Try adjusting your search or filters"
              : selectedProject
                ? "Use the buttons above to generate documents"
                : "Select a project to start generating documents"
          }
          className="py-8"
        />
      ) : (
        <div className="space-y-3">
          {displayedOutputs.map((output) => (
            <div
              key={output.id}
              className="flex items-center justify-between p-3 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/5 rounded-md">{getFileIcon(output.type)}</div>
                <div>
                  <h4 className="font-medium text-foreground">{output.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(output.createdAt)}</span>
                    <span>•</span>
                    <span>{formatFileSize(output.size)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => handleSaveToCloud(output)} className="h-8 w-8 p-0">
                  <Cloud className="h-4 w-4" />
                  <span className="sr-only">Save to cloud</span>
                </Button>
                <Button size="sm" variant="ghost" asChild className="h-8 w-8 p-0">
                  <a href={`/api/download?path=${output.path}`} download aria-label={`Download ${output.name}`}>
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </a>
                </Button>
                <Button size="sm" variant="ghost" asChild className="h-8 w-8 p-0">
                  <a
                    href={`/api/preview?path=${output.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Preview ${output.name}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Preview</span>
                  </a>
                </Button>
              </div>
            </div>
          ))}

          {limit && filteredOutputs.length > limit && (
            <Button
              variant="ghost"
              className="w-full text-primary"
              onClick={() => (window.location.href = "/documents")}
            >
              View all {filteredOutputs.length} documents
            </Button>
          )}
        </div>
      )}

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save to Cloud Storage</DialogTitle>
            <DialogDescription>Select a cloud storage provider to save your document</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">File to save</label>
              <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/20">
                {selectedFile && getFileIcon(selectedFile.type)}
                <span className="font-medium">{selectedFile?.name}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">Select cloud storage</label>
              <Select value={selectedStorage} onValueChange={setSelectedStorage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google-drive">Google Drive</SelectItem>
                  <SelectItem value="onedrive">Microsoft OneDrive</SelectItem>
                  <SelectItem value="dropbox">Dropbox</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfirm}>
              <Cloud className="h-4 w-4 mr-2" />
              Save to Cloud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  )
}

