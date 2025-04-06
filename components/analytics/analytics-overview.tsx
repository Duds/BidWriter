"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, FileText, Users, Zap } from "lucide-react"
import { BarChart } from "./bar-chart"
import { LineChart } from "./line-chart"
import { StatsCard } from "./stats-card"

export function AnalyticsOverview() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Documents"
          value="124"
          change="+12%"
          trend="up"
          icon={<FileText className="h-4 w-4" />}
        />
        <StatsCard title="Active Projects" value="18" change="+3" trend="up" icon={<Activity className="h-4 w-4" />} />
        <StatsCard
          title="AI Credits Used"
          value="2,845"
          change="73%"
          trend="neutral"
          icon={<Zap className="h-4 w-4" />}
        />
        <StatsCard title="Team Members" value="7" change="+1" trend="up" icon={<Users className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Document Generation</CardTitle>
            <CardDescription>Documents generated over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <LineChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Types</CardTitle>
            <CardDescription>Distribution by document type</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <BarChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Usage Insights</CardTitle>
          <CardDescription>AI model performance and usage statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted/20">
            <p className="text-muted-foreground">AI insights visualization coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

