"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CloudFileBrowser } from "./cloud-file-browser"
import { Cloud } from "lucide-react"

interface CloudImportButtonProps {
  onImport?: (files: string[]) => void
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function CloudImportButton({
  onImport,
  variant = "outline",
  size = "default",
  className,
}: CloudImportButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setOpen(true)} className={className}>
        <Cloud className="h-4 w-4 mr-2" />
        Import from Cloud
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Import from Cloud Storage</DialogTitle>
          </DialogHeader>
          <div className="h-[600px] overflow-hidden">
            <CloudFileBrowser />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

