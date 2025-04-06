"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"
import { PageHeader } from "@/components/page-header"

export default function NewProject() {
  const router = useRouter()
  const { toast } = useToast()
  const [projectName, setProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const validateProjectName = (name: string) => {
    if (!name.trim()) {
      return "Project name is required"
    }
    if (name.length < 3) {
      return "Project name must be at least 3 characters"
    }
    if (!/^[a-zA-Z0-9-_ ]+$/.test(name)) {
      return "Project name can only contain letters, numbers, spaces, hyphens, and underscores"
    }
    return ""
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setProjectName(value)
    setError(validateProjectName(value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateProjectName(projectName)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: projectName }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Project created successfully",
        })
        router.push(`/?project=${data.project}`)
      } else {
        setError(data.error || "Failed to create project")
        toast({
          title: "Error",
          description: data.error || "Failed to create project",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating project:", error)
      setError("An unexpected error occurred")
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Create New Project" description="Set up a new bid project">
        <Button variant="outline" onClick={() => router.push("/projects")} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </PageHeader>

      <Card className="max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Enter the details for your new bid project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name" className="flex items-center justify-between">
                <span>Project Name</span>
                {projectName && !error && (
                  <span className="text-xs text-green-600 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" /> Valid name
                  </span>
                )}
              </Label>
              <Input
                id="project-name"
                placeholder="Enter project name"
                value={projectName}
                onChange={handleChange}
                disabled={isLoading}
                className={error ? "border-red-300 focus-visible:ring-red-400" : ""}
              />
              {error && (
                <div className="flex items-center text-xs text-red-600 mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {error}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Choose a descriptive name for your bid project. This will be used to organize all related documents.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading || !!error}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

