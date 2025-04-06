import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModelSelector } from "@/components/ai-models/model-selector"
import { ModelSettings } from "@/components/ai-models/model-settings"
import { SystemPrompts } from "@/components/ai-models/system-prompts"

export default function AIModelsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="AI Models" description="Configure and manage AI model settings" />

      <Tabs defaultValue="models" className="space-y-4">
        <TabsList>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="prompts">System Prompts</TabsTrigger>
        </TabsList>

        <TabsContent value="models">
          <ModelSelector />
        </TabsContent>

        <TabsContent value="settings">
          <ModelSettings />
        </TabsContent>

        <TabsContent value="prompts">
          <SystemPrompts />
        </TabsContent>
      </Tabs>
    </div>
  )
}

