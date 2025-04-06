"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Upload, FileText, FileIcon as FilePresentation, Trash2, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/empty-state"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Template = {
  name: string
  type: "docx" | "pptx"
  path: string
}

export default function TemplatesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [projects, setProjects] = useState<string[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadType, setUploadType] = useState<"proposal" | "deal" | "summary">("proposal")

  useEffect(() => {
    const fetchProjects = async () => {
      try {
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
      }
    }

    fetchProjects()
  }, [searchParams, toast])

  useEffect(() => {
    if (!selectedProject) return

    const fetchTemplates = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/projects/${selectedProject}/templates`)
        const data = await response.json()

        if (data.templates) {
          setTemplates(data.templates)
        }
      } catch (error) {
        console.error("Failed to fetch templates:", error)
        toast({
          title: "Error",
          description: "Failed to load templates",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplates()
  }, [selectedProject, toast])

  const handleProjectChange = (value: string) => {
    setSelectedProject(value)
    router.push(`/templates?project=${value}`)
  }

  const handleUpload = async (type: "proposal" | "deal" | "summary") => {
    setUploadType(type)
    setUploadDialogOpen(true)
  }

  const handleUploadConfirm = () => {
    // In a real implementation, you would upload the file
    toast({
      title: "Template Uploaded",
      description: `${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)} template has been uploaded successfully.`,
    })
    setUploadDialogOpen(false)
  }

  const handleDelete = async (template: Template) => {
    // In a real implementation, you would delete the template
    toast({
      title: "Template Deleted",
      description: `${template.name} has been deleted.`,
    })

    // Remove from local state
    setTemplates(templates.filter((t) => t.path !== template.path))
  }

  const getTemplateIcon = (type: string) => {
    return type === "docx" ? (
      <FileText className="h-5 w-5 text-blue-500" />
    ) : (
      <FilePresentation className="h-5 w-5 text-orange-500" />
    )
  }

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Templates" description="Manage document templates for your projects" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Project</CardTitle>
              <CardDescription>Choose a project to manage templates</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedProject} onValueChange={handleProjectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedProject && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Templates</CardTitle>
                <CardDescription>Add new templates to your project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleUpload("proposal")}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Proposal Template
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleUpload("deal")}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Deal Template
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleUpload("summary")}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Summary Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Templates</CardTitle>
                <CardDescription>Manage your document templates</CardDescription>
              </div>
              {selectedProject && templates.length > 0 && (
                <div className="relative w-[200px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search templates..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading templates...</p>
                </div>
              ) : !selectedProject ? (
                <EmptyState
                  icon={<FileText className="h-6 w-6" />}
                  title="No project selected"
                  description="Please select a project to view templates"
                />
              ) : filteredTemplates.length === 0 ? (
                <EmptyState
                  icon={<FileText className="h-6 w-6" />}
                  title={searchQuery ? "No matching templates" : "No templates found"}
                  description={
                    searchQuery ? "Try adjusting your search query" : "Upload templates using the buttons on the left"
                  }
                  action={
                    searchQuery
                      ? undefined
                      : {
                          label: "Upload Template",
                          onClick: () => handleUpload("proposal"),
                        }
                  }
                />
              ) : (
                <div className="space-y-4">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.path}
                      className="flex items-center justify-between p-3 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/5 rounded-md">{getTemplateIcon(template.type)}</div>
                        <div>
                          <h4 className="font-medium text-foreground">{template.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {template.type === "docx" ? "Word Document" : "PowerPoint Presentation"}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(template)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Template</DialogTitle>
            <DialogDescription>Upload a {uploadType} template for your project</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {uploadType === "proposal" || uploadType === "summary" ? "DOCX file only" : "PPTX file only"}
                  </p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" />
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadConfirm}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

