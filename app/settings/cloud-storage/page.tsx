import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CloudStorageConnect } from "@/components/cloud-storage/cloud-storage-connect"
import { CloudFileBrowser } from "@/components/cloud-storage/cloud-file-browser"

export default function CloudStoragePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Cloud Storage" description="Connect and manage your cloud storage providers" />

      <Tabs defaultValue="connections" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="connections">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Provider Status</CardTitle>
                <CardDescription>Manage your cloud storage connections</CardDescription>
              </CardHeader>
              <CardContent>
                <CloudStorageConnect />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Connection Details</CardTitle>
                <CardDescription>View and manage connection details</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Select a provider to view details</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>Cloud Files</CardTitle>
              <CardDescription>Browse and manage your files across cloud storage providers</CardDescription>
            </CardHeader>
            <CardContent>
              <CloudFileBrowser />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Sync Settings</CardTitle>
              <CardDescription>Configure synchronization settings for cloud storage</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Sync settings coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

