"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { LogIn, Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type CloudProvider = {
  id: string
  name: string
  icon: React.ReactNode
  connected: boolean
  lastSync?: string
}

export function CloudStorageConnect() {
  const { toast } = useToast()
  const [providers, setProviders] = useState<CloudProvider[]>([
    {
      id: "google-drive",
      name: "Google Drive",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3 1.4.8 2.9 1.2 4.5 1.2h51.8c1.6 0 3.1-.4 4.5-1.2 1.35-.8 2.5-1.9 3.3-3.3l3.85-6.65-75.1 0z"
            fill="#0066da"
          />
          <path d="m45.75 12.1-9.1 15.7-20.35 35.05h75.1l-20.35-35.05-9.1-15.7z" fill="#00ac47" />
          <path
            d="m14.35 62.85 10.75-18.5-10.75-18.5c-.8-1.4-1.2-2.9-1.2-4.5s.4-3.1 1.2-4.5c.8-1.35 1.9-2.5 3.3-3.3 1.4-.8 2.9-1.2 4.5-1.2h-8.8c-1.6 0-3.1.4-4.5 1.2-1.35.8-2.5 1.95-3.3 3.3-.8 1.4-1.2 2.9-1.2 4.5s.4 3.1 1.2 4.5z"
            fill="#ea4335"
          />
          <path
            d="m72.95 62.85 10.75-18.5-10.75-18.5c-.8-1.4-1.2-2.9-1.2-4.5s.4-3.1 1.2-4.5c.8-1.35 1.9-2.5 3.3-3.3 1.4-.8 2.9-1.2 4.5-1.2h-8.8c-1.6 0-3.1.4-4.5 1.2-1.35.8-2.5 1.95-3.3 3.3-.8 1.4-1.2 2.9-1.2 4.5s.4 3.1 1.2 4.5z"
            fill="#00832d"
          />
          <path
            d="m55.65 12.1h-24c-1.6 0-3.1.4-4.5 1.2-1.4.8-2.5 1.95-3.3 3.3l10.8 18.5 9.1-15.7 9.1 15.7 10.8-18.5c-.8-1.35-1.95-2.5-3.3-3.3-1.4-.8-2.9-1.2-4.5-1.2z"
            fill="#ffba00"
          />
        </svg>
      ),
      connected: false,
    },
    {
      id: "onedrive",
      name: "Microsoft OneDrive",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.5 12.5H1.5L7.5 18.5H16.5L10.5 12.5Z" fill="#0364B8" />
          <path d="M10.5 12.5L16.5 18.5L22.5 12.5H10.5Z" fill="#0078D4" />
          <path d="M16.5 18.5L10.5 12.5L7.5 5.5L16.5 11.5V18.5Z" fill="#1490DF" />
          <path d="M7.5 5.5L10.5 12.5H22.5L16.5 5.5H7.5Z" fill="#28A8EA" />
        </svg>
      ),
      connected: false,
    },
    {
      id: "dropbox",
      name: "Dropbox",
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 2L0 6L6 10L0 14L6 18L12 14L18 18L24 14L18 10L24 6L18 2L12 6L6 2Z" fill="#0061FF" />
        </svg>
      ),
      connected: false,
    },
  ])

  const handleConnect = (providerId: string) => {
    // In a real implementation, this would initiate OAuth flow
    // For this example, we'll simulate a successful connection

    setTimeout(() => {
      setProviders(
        providers.map((provider) =>
          provider.id === providerId
            ? {
                ...provider,
                connected: true,
                lastSync: new Date().toLocaleString("en-AU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }
            : provider,
        ),
      )

      toast({
        title: "Connected successfully",
        description: `Your account has been connected to ${providers.find((p) => p.id === providerId)?.name}`,
      })
    }, 1000)
  }

  const handleDisconnect = (providerId: string) => {
    // In a real implementation, this would revoke OAuth tokens
    // For this example, we'll simulate disconnection

    setProviders(
      providers.map((provider) =>
        provider.id === providerId ? { ...provider, connected: false, lastSync: undefined } : provider,
      ),
    )

    toast({
      title: "Disconnected",
      description: `Your ${providers.find((p) => p.id === providerId)?.name} account has been disconnected`,
    })
  }

  return (
    <div className="space-y-4">
      {providers.map((provider) => (
        <div
          key={provider.id}
          className={cn(
            "flex items-center justify-between p-4 rounded-lg border transition-colors",
            provider.connected ? "bg-primary/5 border-primary/20" : "bg-card hover:bg-muted/50",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">{provider.icon}</div>
            <div>
              <h3 className="font-medium">{provider.name}</h3>
              {provider.connected ? (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <Check className="h-3 w-3" />
                  <span>Connected • {provider.lastSync}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <AlertCircle className="h-3 w-3" />
                  <span>Not connected</span>
                </div>
              )}
            </div>
          </div>

          {provider.connected ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manage {provider.name} Connection</DialogTitle>
                  <DialogDescription>Your account is currently connected to {provider.name}.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm mb-4">Connected since: {provider.lastSync}</p>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => handleDisconnect(provider.id)}>
                      Disconnect
                    </Button>
                    <Button
                      onClick={() =>
                        toast({
                          title: "Sync started",
                          description: "Synchronizing with your cloud storage...",
                        })
                      }
                    >
                      Sync Now
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Button variant="outline" size="sm" onClick={() => handleConnect(provider.id)}>
              <LogIn className="h-4 w-4 mr-2" />
              Connect
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}

