"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, RotateCcw, FileText, FileIcon, FileSpreadsheet } from "lucide-react"

export function SystemPrompts() {
  const { toast } = useToast()
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [projects, setProjects] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [proposalPrompt, setProposalPrompt] = useState(`VERSION: 1.0.0
LAST_MODIFIED: ${new Date().toISOString()}

ROLE: Senior Bid Proposal Writer
COMPANY: Atturra
TASK: Analyze RFPs and generate comprehensive, professional bid proposals

You are an expert bid proposal writer for Atturra, a leading technology consulting firm. Your task is to analyze the provided RFP documents and generate a comprehensive, professional bid proposal that addresses all requirements and showcases Atturra's capabilities.

Please structure your response according to the template provided, using markdown formatting for better readability.`)

  const [dealPrompt, setDealPrompt] = useState(`VERSION: 1.0.0
LAST_MODIFIED: ${new Date().toISOString()}

ROLE: Deal Approval Specialist
COMPANY: Atturra
TASK: Analyze business opportunities and generate deal approval documents

You are an expert in analyzing business opportunities and creating deal approval documents. Your task is to review the provided RFP documents and generate a comprehensive deal approval presentation that outlines the opportunity, risks, and recommended approach.

Please structure your response according to the template provided, using markdown formatting for better readability.`)

  const [summaryPrompt, setSummaryPrompt] = useState(`VERSION: 1.0.0
LAST_MODIFIED: ${new Date().toISOString()}

ROLE: Executive Summary Specialist
COMPANY: Atturra
TASK: Generate concise and professional executive summaries for bid proposals

You are an expert in creating executive summaries for bid proposals. Your task is to analyze the provided RFP documents and generate a comprehensive executive summary that highlights the key points, requirements, and evaluation criteria.

Please structure your response according to the template provided, using markdown formatting for better readability.`)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects")
        const data = await response.json()

        if (data.projects) {
          setProjects(data.projects)
          if (data.projects.length > 0) {
            setSelectedProject(data.projects[0])
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
  }, [toast])

  const handleSavePrompts = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Prompts Saved",
        description: "System prompts have been updated successfully.",
      })
    }, 1000)
  }

  const handleResetPrompts = (type: "proposal" | "deal" | "summary") => {
    if (type === "proposal") {
      setProposalPrompt(`VERSION: 1.0.0
LAST_MODIFIED: ${new Date().toISOString()}

ROLE: Senior Bid Proposal Writer
COMPANY: Atturra
TASK: Analyze RFPs and generate comprehensive, professional bid proposals

You are an expert bid proposal writer for Atturra, a leading technology consulting firm. Your task is to analyze the provided RFP documents and generate a comprehensive, professional bid proposal that addresses all requirements and showcases Atturra's capabilities.

Please structure your response according to the template provided, using markdown formatting for better readability.`)
    } else if (type === "deal") {
      setDealPrompt(`VERSION: 1.0.0
LAST_MODIFIED: ${new Date().toISOString()}

ROLE: Deal Approval Specialist
COMPANY: Atturra
TASK: Analyze business opportunities and generate deal approval documents

You are an expert in analyzing business opportunities and creating deal approval documents. Your task is to review the provided RFP documents and generate a comprehensive deal approval presentation that outlines the opportunity, risks, and recommended approach.

Please structure your response according to the template provided, using markdown formatting for better readability.`)
    } else if (type === "summary") {
      setSummaryPrompt(`VERSION: 1.0.0
LAST_MODIFIED: ${new Date().toISOString()}

ROLE: Executive Summary Specialist
COMPANY: Atturra
TASK: Generate concise and professional executive summaries for bid proposals

You are an expert in creating executive summaries for bid proposals. Your task is to analyze the provided RFP documents and generate a comprehensive executive summary that highlights the key points, requirements, and evaluation criteria.

Please structure your response according to the template provided, using markdown formatting for better readability.`)
    }

    toast({
      title: "Prompt Reset",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} prompt has been reset to default.`,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Prompts</CardTitle>
          <CardDescription>Configure the system prompts used for different document types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Project</label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="mt-1">
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
              <p className="text-xs text-muted-foreground mt-1">System prompts are specific to each project</p>
            </div>

            <Tabs defaultValue="proposal" className="mt-6">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="proposal" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Proposal</span>
                </TabsTrigger>
                <TabsTrigger value="deal" className="flex items-center gap-2">
                  <FileIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Deal</span>
                </TabsTrigger>
                <TabsTrigger value="summary" className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span className="hidden sm:inline">Summary</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="proposal">
                <div className="space-y-4">
                  <Textarea
                    value={proposalPrompt}
                    onChange={(e) => setProposalPrompt(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleResetPrompts("proposal")}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="deal">
                <div className="space-y-4">
                  <Textarea
                    value={dealPrompt}
                    onChange={(e) => setDealPrompt(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleResetPrompts("deal")}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="summary">
                <div className="space-y-4">
                  <Textarea
                    value={summaryPrompt}
                    onChange={(e) => setSummaryPrompt(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleResetPrompts("summary")}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button onClick={handleSavePrompts} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save All Prompts"}
        </Button>
      </div>
    </div>
  )
}

