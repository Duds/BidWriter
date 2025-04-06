import { ProjectSelector } from "@/components/project-selector"
import { StatusPanel } from "@/components/status-panel"
import { ProcessingDashboard } from "@/components/processing-dashboard"
import { OutputDisplay } from "@/components/output-display"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/page-header"
import { RecentActivity } from "@/components/recent-activity"

export default function Home() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Manage your projects and generate documents" />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Project Setup</CardTitle>
                <CardDescription>Select or create a project to begin</CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectSelector />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system and connection status</CardDescription>
              </CardHeader>
              <CardContent>
                <StatusPanel />
              </CardContent>
            </Card>
          </div>

          <ProcessingDashboard />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Recent Documents</CardTitle>
                <CardDescription>Your recently generated documents</CardDescription>
              </CardHeader>
              <CardContent>
                <OutputDisplay limit={3} />
              </CardContent>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Activity</CardTitle>
                <CardDescription>Recent system activity</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>All Documents</CardTitle>
              <CardDescription>View and manage all your generated documents</CardDescription>
            </CardHeader>
            <CardContent>
              <OutputDisplay />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View usage statistics and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md bg-muted/20">
                <p className="text-muted-foreground">Analytics dashboard coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

