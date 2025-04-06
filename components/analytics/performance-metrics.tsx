"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricCard } from "./metric-card"

export function PerformanceMetrics() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>AI Model Performance</CardTitle>
          <CardDescription>Metrics for AI model performance and efficiency</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="accuracy">
            <TabsList className="mb-4">
              <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
              <TabsTrigger value="speed">Speed</TabsTrigger>
              <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
            </TabsList>
            
            <TabsContent value="accuracy">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MetricCard
                    title="Content Accuracy"
                    value="94.8%"
                    trend="up"
                    change="+1.2%"
                    description="Based on user feedback and reviews" 
                  />
                  <MetricCard 
                    title="Format Compliance" 
                    value="98.2%" 
                    trend="up" 
                    change="+0.5%" 
                    description="Template adherence score" 
                  />
                  <MetricCard 
                    title="Error Rate" 
                    value="1.3%" 
                    trend="down" 
                    change="-0.4%" 
                    description="Detected errors in generated content" 
                  />
                </div>
                
                <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">Accuracy metrics visualization coming soon</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="speed">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MetricCard 
                    title="Avg. Generation Time" 
                    value="42s" 
                    trend="down" 
                    change="-8s" 
                    description="Time to generate a document" 
                  />
                  <MetricCard 
                    title="Processing Speed" 
                    value="1.8MB/s" 
                    trend="up" 
                    change="+0.3MB/s" 
                    description="Document processing throughput" 
                  />
                  <MetricCard 
                    title="Response Time" 
                    value="1.2s" 
                    trend="down" 
                    change="-0.3s" 
                    description="Average API response time" 
                  />
                </div>
                
                <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">Speed metrics visualization coming soon</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="efficiency">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MetricCard 
                    title="Token Efficiency" 
                    value="82.4%" 
                    trend="up" 
                    change="+3.7%" 
                    description="Effective use of AI tokens" 
                  />
                  <MetricCard 
                    title="Cost per Document" 
                    value="$0.18" 
                    trend="down" 
                    change="-$0.03" 
                    description="Average cost in AI credits" 
                  />
                  <MetricCard 
                    title="Completion Rate" 
                    value="99.7%" 
                    trend="up" 
                    change="+0.2%" 
                    description="Successfully completed generations" 
                  />
                </div>
                
                <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">Efficiency metrics visualization coming soon</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

