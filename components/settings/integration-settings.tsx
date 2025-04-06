"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Save, Plus, Trash2, RefreshCw, Check } from "lucide-react"

type Integration = {
  id: string
  name: string
  description: string
  connected: boolean
  apiKey?: string
  lastSync?: string
}

export function IntegrationSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "openai",
      name: "OpenAI",
      description: "Connect to OpenAI API for AI-powered document generation",
      connected: true,
      apiKey: "sk-...REDACTED",
      lastSync: "15/04/2023 14:30",
    },
    {
      id: "microsoft365",
      name: "Microsoft 365",
      description: "Connect to Microsoft 365 for document templates and storage",
      connected: false,
    },
    {
      id: "google-workspace",
      name: "Google Workspace",
      description: "Connect to Google Workspace for document collaboration",
      connected: true,
      lastSync: "10/04/2023 09:15",
    },
    {
      id: "salesforce",
      name: "Salesforce",
      description: "Connect to Salesforce for CRM integration",
      connected: false,
    },
  ])

  const [webhooks, setWebhooks] = useState([
    {
      id: "webhook1",
      name: "Document Generation Webhook",
      url: "https://example.com/webhook/documents",
      active: true,
      events: ["document.created", "document.updated"],
    },
    {
      id: "webhook2",
      name: "Project Updates Webhook",
      url: "https://example.com/webhook/projects",
      active: false,
      events: ["project.created", "project.updated"],
    },
  ])

  const handleToggleIntegration = (id: string, connected: boolean) => {
    setIntegrations(
      integrations.map((integration) => (integration.id === id ? { ...integration, connected } : integration)),
    )

    toast({
      title: connected ? "Integration Connected" : "Integration Disconnected",
      description: `${integrations.find((i) => i.id === id)?.name} has been ${connected ? "connected" : "disconnected"} successfully.`,
    })
  }

  const handleSaveApiKey = (id: string, apiKey: string) => {
    setIntegrations(
      integrations.map((integration) =>
        integration.id === id ? { ...integration, apiKey, connected: true } : integration,
      ),
    )

    toast({
      title: "API Key Saved",
      description: `${integrations.find((i) => i.id === id)?.name} API key has been updated successfully.`,
    })
  }

  const handleToggleWebhook = (id: string, active: boolean) => {
    setWebhooks(webhooks.map((webhook) => (webhook.id === id ? { ...webhook, active } : webhook)))

    toast({
      title: active ? "Webhook Activated" : "Webhook Deactivated",
      description: `${webhooks.find((w) => w.id === id)?.name} has been ${active ? "activated" : "deactivated"} successfully.`,
    })
  }

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter((webhook) => webhook.id !== id))

    toast({
      title: "Webhook Deleted",
      description: "The webhook has been deleted successfully.",
    })
  }

  const handleAddWebhook = () => {
    const newWebhook = {
      id: `webhook${webhooks.length + 1}`,
      name: "New Webhook",
      url: "https://example.com/webhook/new",
      active: false,
      events: ["document.created"],
    }

    setWebhooks([...webhooks, newWebhook])

    toast({
      title: "Webhook Added",
      description: "A new webhook has been added. Configure it to start receiving events.",
    })
  }

  const handleTestIntegration = (id: string) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      const integration = integrations.find((i) => i.id === id)

      toast({
        title: "Integration Test",
        description: `${integration?.name} integration test ${Math.random() > 0.2 ? "successful" : "failed"}. Check logs for details.`,
      })
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>External Integrations</CardTitle>
          <CardDescription>Connect to external services and APIs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {integrations.map((integration) => (
            <div key={integration.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    {integration.name}
                    {integration.connected && (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                      >
                        Connected
                      </Badge>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{integration.description}</p>
                </div>
                <Switch
                  checked={integration.connected}
                  onCheckedChange={(checked) => handleToggleIntegration(integration.id, checked)}
                />
              </div>

              {integration.connected && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${integration.id}-api-key`}>API Key</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`${integration.id}-api-key`}
                          type="password"
                          value={integration.apiKey || ""}
                          onChange={(e) => handleSaveApiKey(integration.id, e.target.value)}
                          placeholder="Enter API key"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleTestIntegration(integration.id)}
                          disabled={isLoading}
                        >
                          {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {integration.lastSync && (
                      <div>
                        <Label>Last Synchronized</Label>
                        <p className="text-sm mt-2">{integration.lastSync}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Webhooks</CardTitle>
            <CardDescription>Configure webhooks to receive event notifications</CardDescription>
          </div>
          <Button size="sm" onClick={handleAddWebhook}>
            <Plus className="h-4 w-4 mr-2" />
            Add Webhook
          </Button>
        </CardHeader>
        <CardContent>
          {webhooks.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No webhooks configured. Add a webhook to receive event notifications.
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{webhook.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{webhook.url}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={webhook.active}
                        onCheckedChange={(checked) => handleToggleWebhook(webhook.id, checked)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteWebhook(webhook.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <Label className="text-xs">Events</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="secondary">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-4">
          <Button onClick={() => toast({ title: "Webhooks Saved" })}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

