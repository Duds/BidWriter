"use client"

import React from 'react'

interface MetricCardProps {
  title: string
  value: string
  trend: 'up' | 'down'
  change: string
  description: string
}

export function MetricCard({ title, value, trend, change, description }: MetricCardProps) {
  return (
    <div className="p-4 border rounded-lg bg-background">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <span
          className={`text-xs font-semibold ${
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {change}
        </span>
      </div>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
