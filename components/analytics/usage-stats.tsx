"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function UsageStats() {
  const usageData = [
    {
      month: "January",
      documents: 18,
      aiCredits: 450,
      storage: "120 MB",
      percentOfLimit: 15,
    },
    {
      month: "February",
      documents: 24,
      aiCredits: 580,
      storage: "145 MB",
      percentOfLimit: 19,
    },
    {
      month: "March",
      documents: 32,
      aiCredits: 720,
      storage: "210 MB",
      percentOfLimit: 24,
    },
    {
      month: "April",
      documents: 28,
      aiCredits: 650,
      storage: "180 MB",
      percentOfLimit: 22,
    },
    {
      month: "May",
      documents: 22,
      aiCredits: 445,
      storage: "130 MB",
      percentOfLimit: 15,
    },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Usage</CardTitle>
          <CardDescription>Track your resource usage over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>AI Credits</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead>% of Limit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usageData.map((item) => (
                <TableRow key={item.month}>
                  <TableCell className="font-medium">{item.month}</TableCell>
                  <TableCell>{item.documents}</TableCell>
                  <TableCell>{item.aiCredits}</TableCell>
                  <TableCell>{item.storage}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={item.percentOfLimit} className="h-2 w-[60px]" />
                      <span className="text-xs">{item.percentOfLimit}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your subscription details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Business Plan</p>
                  <p className="text-xs text-muted-foreground">Renews on 15/06/2023</p>
                </div>
                <Badge>Active</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monthly document limit:</span>
                  <span className="font-medium">100 / 150</span>
                </div>
                <Progress value={66} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">AI credits:</span>
                  <span className="font-medium">2,845 / 3,000</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Storage:</span>
                  <span className="font-medium">785 MB / 10 GB</span>
                </div>
                <Progress value={8} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Breakdown</CardTitle>
            <CardDescription>How your resources are being used</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Proposal Generation:</span>
                  <span className="font-medium">65%</span>
                </div>
                <Progress value={65} className="h-2 bg-blue-100 dark:bg-blue-950" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Deal Approval:</span>
                  <span className="font-medium">20%</span>
                </div>
                <Progress value={20} className="h-2 bg-orange-100 dark:bg-orange-950" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Executive Summary:</span>
                  <span className="font-medium">15%</span>
                </div>
                <Progress value={15} className="h-2 bg-green-100 dark:bg-green-950" />
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">Based on AI credit usage over the last 30 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

