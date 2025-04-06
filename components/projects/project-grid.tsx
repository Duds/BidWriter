"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Folder, FileText, MoreHorizontal, Calendar, ArrowUpRight } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/empty-state"

type Project = {
  id: string
  name: string
  createdAt: string
  documentsCount: number
  templatesCount: number
  lastModified: string
  status: "active" | "archived" | "completed"
}

export function ProjectGrid() {
  const router = useRouter()
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        // In a real app, this would be an API call
        // For now, we'll simulate with mock data
        const response = await fetch("/api/projects")
        const data = await response.json()

        // Transform the data into our Project type
        if (data.projects) {
          // Create mock project data based on project names
          const mockProjects: Project[] = data.projects.map((name: string, index: number) => ({
            id: `project-${index}`,
            name,
            createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            documentsCount: Math.floor(Math.random() * 10),
            templatesCount: Math.floor(Math.random() * 5),
            lastModified: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
            status: ["active", "archived", "completed"][Math.floor(Math.random() * 3)] as
              | "active"
              | "archived"
              | "completed",
          }))

          setProjects(mockProjects)
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error)
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [toast])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const handleProjectClick = (projectId: string, projectName: string) => {
    router.push(`/?project=${projectName}`)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="opacity-70 animate-pulse">
            <CardHeader className="pb-2">
              <CardTitle className="h-6 bg-muted rounded"></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-8 bg-muted rounded w-1/4"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={<Folder className="h-6 w-6" />}
        title="No projects found"
        description="Create your first project to get started"
        action={{
          label: "Create Project",
          onClick: () => router.push("/projects/new"),
        }}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push(`/projects/${project.id}/edit`)}>Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/projects/${project.id}/templates`)}>
                    Manage Templates
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast({ title: "Project archived" })}>Archive</DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => toast({ title: "Project deleted", variant: "destructive" })}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Badge className={`self-start ${getStatusColor(project.status)}`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Documents:</span>
                </div>
                <span>{project.documentsCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                </div>
                <span>{formatDate(project.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Modified:</span>
                </div>
                <span>{formatDate(project.lastModified)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2 border-t">
            <Button variant="ghost" size="sm" onClick={() => router.push(`/projects/${project.id}`)}>
              Details
            </Button>
            <Button size="sm" onClick={() => handleProjectClick(project.id, project.name)} className="gap-1">
              Open
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

