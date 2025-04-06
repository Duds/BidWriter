"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Zap, Check, Info, AlertTriangle, Lock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

type AIModel = {
  id: string
  name: string
  provider: string
  description: string
  capabilities: string[]
  isPremium: boolean
  isRecommended?: boolean
  isActive?: boolean
}

export function ModelSelector() {
  const { toast } = useToast()
  const [models, setModels] = useState<AIModel[]>([
    {
      id: "gpt-4o",
      name: "GPT-4o",
      provider: "OpenAI",
      description: "Latest multimodal model with advanced reasoning capabilities",
      capabilities: ["Advanced reasoning", "High accuracy", "Context awareness"],
      isPremium: true,
      isRecommended: true,
      isActive: true,
    },
    {
      id: "gpt-4-turbo",
      name: "GPT-4 Turbo",
      provider: "OpenAI",
      description: "Powerful model with strong reasoning and knowledge",
      capabilities: ["Strong reasoning", "High accuracy", "Large context window"],
      isPremium: true,
    },
    {
      id: "gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      provider: "OpenAI",
      description: "Fast and cost-effective model for most use cases",
      capabilities: ["Fast responses", "Cost-effective", "Good accuracy"],
      isPremium: false,
    },
    {
      id: "claude-3-opus",
      name: "Claude 3 Opus",
      provider: "Anthropic",
      description: "Anthropic's most capable model for complex tasks",
      capabilities: ["Complex reasoning", "Nuanced understanding", "Long context"],
      isPremium: true,
    },
    {
      id: "claude-3-sonnet",
      name: "Claude 3 Sonnet",
      provider: "Anthropic",
      description: "Balanced model for most enterprise use cases",
      capabilities: ["Balanced performance", "Good reasoning", "Cost-effective"],
      isPremium: false,
    },
  ])

  const [selectedModel, setSelectedModel] = useState<AIModel | null>(models.find((m) => m.isActive) || null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string>("openai")

  const handleModelSelect = (model: AIModel) => {
    setSelectedModel(model)
    setConfirmDialogOpen(true)
  }

  const handleConfirmModel = () => {
    if (!selectedModel) return

    // Update active model
    setModels(
      models.map((model) => ({
        ...model,
        isActive: model.id === selectedModel.id,
      })),
    )

    toast({
      title: "AI Model Updated",
      description: `Now using ${selectedModel.name} for document generation.`,
    })

    setConfirmDialogOpen(false)
  }

  const handleAddProvider = () => {
    setApiKeyDialogOpen(true)
  }

  const handleSaveApiKey = () => {
    toast({
      title: "API Key Saved",
      description: `Successfully connected to ${
        selectedProvider === "openai"
          ? "OpenAI"
          : selectedProvider === "anthropic"
            ? "Anthropic"
            : "the selected provider"
      }.`,
    })

    setApiKeyDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Available Models</h3>
          <p className="text-sm text-muted-foreground">Select an AI model to use for document generation</p>
        </div>
        <Button onClick={handleAddProvider}>Add Provider</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {models.map((model) => (
          <Card
            key={model.id}
            className={`cursor-pointer hover:shadow-md transition-shadow ${model.isActive ? "border-primary" : ""}`}
            onClick={() => handleModelSelect(model)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                  {model.isRecommended && (
                    <Badge variant="secondary" className="text-xs">
                      Recommended
                    </Badge>
                  )}
                  {model.isPremium && (
                    <Badge variant="outline" className="text-xs">
                      Premium
                    </Badge>
                  )}
                </div>
                {model.isActive && (
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                )}
              </div>
              <CardDescription>{model.provider}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-3">{model.description}</p>
              <div className="flex flex-wrap gap-2">
                {model.capabilities.map((capability, index) => (
                  <Badge key={index} variant="secondary" className="bg-secondary/50">
                    {capability}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-2 border-t">
              <div className="flex items-center text-xs text-muted-foreground">
                <Zap className="h-3 w-3 mr-1" />
                {model.isPremium ? "Higher token usage" : "Standard token usage"}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-muted-foreground" />
            Model Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Current Active Model</h4>
                <p className="text-sm text-muted-foreground">
                  {models.find((m) => m.isActive)?.name || "None selected"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Provider</h4>
                <p className="text-sm text-muted-foreground">{models.find((m) => m.isActive)?.provider || "None"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">API Status</h4>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Last Checked</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleString("en-AU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center p-3 rounded-md bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0" />
              <p className="text-xs text-amber-800 dark:text-amber-300">
                Changing the AI model may affect the quality and style of generated documents. Test with sample content
                before using in production.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change AI Model</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the active AI model to {selectedModel?.name}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm mb-4">
              This will affect all future document generations. The new model may produce different results than your
              previous model.
            </p>
            {selectedModel?.isPremium && (
              <div className="flex items-center p-3 rounded-md bg-blue-50 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-900">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  This is a premium model and may consume more AI credits than standard models.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmModel}>Confirm Change</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add AI Provider</DialogTitle>
            <DialogDescription>Connect to an AI provider by adding your API key</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Select Provider</Label>
              <RadioGroup
                defaultValue={selectedProvider}
                onValueChange={setSelectedProvider}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="openai" id="openai" />
                  <Label htmlFor="openai" className="flex items-center gap-2">
                    OpenAI
                    <Badge variant="outline" className="ml-2">
                      Connected
                    </Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="anthropic" id="anthropic" />
                  <Label htmlFor="anthropic">Anthropic</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="azure" id="azure" disabled />
                  <Label htmlFor="azure" className="flex items-center gap-2 text-muted-foreground">
                    Azure OpenAI
                    <Lock className="h-3 w-3 ml-1" />
                    <Badge variant="outline" className="ml-2">
                      Coming Soon
                    </Badge>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  id="api-key"
                  placeholder="Enter your API key"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={selectedProvider === "openai"}
                />
              </div>
              {selectedProvider === "openai" && (
                <p className="text-xs text-muted-foreground">
                  OpenAI API key is already configured. You can update it in the environment variables.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApiKeyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveApiKey} disabled={selectedProvider === "openai"}>
              Save API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

