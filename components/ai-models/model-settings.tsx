"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Info, Save, RotateCcw } from "lucide-react"

export function ModelSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    temperature: 0.3,
    maxTokens: 16384,
    topP: 1.0,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    streamResponse: true,
    enhancedContext: true,
    autoSummarize: false,
  })

  const handleSliderChange = (name: string, value: number[]) => {
    setSettings({
      ...settings,
      [name]: value[0],
    })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings({
      ...settings,
      [name]: checked,
    })
  }

  const handleInputChange = (name: string, value: string) => {
    setSettings({
      ...settings,
      [name]: Number.parseInt(value) || 0,
    })
  }

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "AI model settings have been updated successfully.",
    })
  }

  const handleReset = () => {
    setSettings({
      temperature: 0.3,
      maxTokens: 16384,
      topP: 1.0,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      streamResponse: true,
      enhancedContext: true,
      autoSummarize: false,
    })

    toast({
      title: "Settings Reset",
      description: "AI model settings have been reset to defaults.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generation Parameters</CardTitle>
          <CardDescription>Configure how the AI model generates content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Temperature: {settings.temperature}</Label>
                <span className="text-xs text-muted-foreground">
                  {settings.temperature < 0.3
                    ? "More deterministic"
                    : settings.temperature > 0.7
                      ? "More creative"
                      : "Balanced"}
                </span>
              </div>
              <Slider
                value={[settings.temperature]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={(value) => handleSliderChange("temperature", value)}
              />
              <p className="text-xs text-muted-foreground">
                Controls randomness: Lower values are more deterministic, higher values are more creative.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Max Tokens</Label>
                <Input
                  type="number"
                  value={settings.maxTokens}
                  onChange={(e) => handleInputChange("maxTokens", e.target.value)}
                  className="w-24 h-8"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Maximum number of tokens to generate. Higher values allow for longer documents.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Top P: {settings.topP}</Label>
                <span className="text-xs text-muted-foreground">
                  {settings.topP < 0.5 ? "More focused" : settings.topP > 0.9 ? "More diverse" : "Balanced"}
                </span>
              </div>
              <Slider
                value={[settings.topP]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={(value) => handleSliderChange("topP", value)}
              />
              <p className="text-xs text-muted-foreground">
                Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are
                considered.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Frequency Penalty: {settings.frequencyPenalty}</Label>
              </div>
              <Slider
                value={[settings.frequencyPenalty]}
                min={0}
                max={2}
                step={0.1}
                onValueChange={(value) => handleSliderChange("frequencyPenalty", value)}
              />
              <p className="text-xs text-muted-foreground">
                Reduces repetition by penalizing tokens that have already appeared in the text.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Presence Penalty: {settings.presencePenalty}</Label>
              </div>
              <Slider
                value={[settings.presencePenalty]}
                min={0}
                max={2}
                step={0.1}
                onValueChange={(value) => handleSliderChange("presencePenalty", value)}
              />
              <p className="text-xs text-muted-foreground">
                Encourages the model to talk about new topics by penalizing tokens that have appeared at all.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Options</CardTitle>
          <CardDescription>Configure additional AI behavior settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="stream-response">Stream Response</Label>
              <p className="text-xs text-muted-foreground">Show generation results in real-time as they're created</p>
            </div>
            <Switch
              id="stream-response"
              checked={settings.streamResponse}
              onCheckedChange={(checked) => handleSwitchChange("streamResponse", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enhanced-context">Enhanced Context</Label>
              <p className="text-xs text-muted-foreground">
                Provide additional context from similar documents to improve quality
              </p>
            </div>
            <Switch
              id="enhanced-context"
              checked={settings.enhancedContext}
              onCheckedChange={(checked) => handleSwitchChange("enhancedContext", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-summarize">Auto-Summarize</Label>
              <p className="text-xs text-muted-foreground">Automatically generate summaries for long documents</p>
            </div>
            <Switch
              id="auto-summarize"
              checked={settings.autoSummarize}
              onCheckedChange={(checked) => handleSwitchChange("autoSummarize", checked)}
            />
          </div>

          <div className="flex items-center p-3 rounded-md bg-blue-50 border border-blue-200 mt-4 dark:bg-blue-950/30 dark:border-blue-900">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
            <p className="text-xs text-blue-800 dark:text-blue-300">
              These settings apply to all document types. For document-specific settings, configure the system prompts.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}

