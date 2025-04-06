"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useProjectStore } from "@/lib/stores/project-store"
import { FileText, Plus } from "lucide-react"
import { CloudImportButton } from "./cloud-storage/cloud-import-button"

export function ProjectSelector() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [projects, setProjects] = useState<string[]>([])

  const { selectedProject, setSelectedProject } = useProjectStore()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/projects")
        const data = await response.json()

        if (data.projects) {
          setProjects(data.projects)

          // Check if there's a project in the URL params
          const projectParam = searchParams.get("project")
          if (projectParam && data.projects.includes(projectParam)) {
            setSelectedProject(projectParam)
          }
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error)
        toast({
          title: "Error",
          description: "Failed to load project list",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [searchParams, setSelectedProject, toast])

  const handleProjectChange = (value: string) => {
    setSelectedProject(value)
    router.push(`?project=${value}`)

    toast({
      title: "Project Selected",
      description: `Now working with project: ${value}`,
    })
  }

  const handleCloudImport = (files: string[]) => {
    toast({
      title: "Files imported",
      description: `${files.length} files imported from cloud storage`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Select disabled={isLoading} value={selectedProject} onValueChange={handleProjectChange}>
          <SelectTrigger className="w-full" aria-label="Select a project">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground">No projects found</div>
            ) : (
              projects.map((project) => (
                <SelectItem key={project} value={project}>
                  {project}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {isLoading && (
          <p className="text-xs text-muted-foreground" aria-live="polite">
            Loading projects...
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="outline" size="sm" className="justify-start" onClick={() => router.push("/projects/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
        <Button variant="outline" size="sm" className="justify-start" onClick={() => router.push("/templates")}>
          <FileText className="mr-2 h-4 w-4" />
          Manage Templates
        </Button>
        <CloudImportButton variant="outline" size="sm" className="justify-start" onImport={handleCloudImport} />
      </div>
    </div>
  )
}

