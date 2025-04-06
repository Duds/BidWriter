"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Folder, MoreHorizontal, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/empty-state"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Project = {
  id: string
  name: string
  createdAt: string
  documentsCount: number
  templatesCount: number
  lastModified: string
  status: "active" | "archived" | "completed"
}

export function ProjectList() {
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
      <Card className="opacity-70 animate-pulse">
        <div className="p-4">
          <div className="h-8 bg-muted rounded w-full mb-4"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-muted rounded w-full mb-2"></div>
          ))}
        </div>
      </Card>
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
    <Card>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <div className="flex items-center gap-1">
                  Project Name
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{project.documentsCount}</TableCell>
                <TableCell>{formatDate(project.createdAt)}</TableCell>
                <TableCell>{formatDate(project.lastModified)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/projects/${project.id}`)}>
                      Details
                    </Button>
                    <Button size="sm" onClick={() => handleProjectClick(project.id, project.name)}>
                      Open
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/projects/${project.id}/edit`)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/projects/${project.id}/templates`)}>
                          Manage Templates
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Project archived" })}>
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => toast({ title: "Project deleted", variant: "destructive" })}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

