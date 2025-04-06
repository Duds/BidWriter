"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import {
  Search,
  FolderOpen,
  File,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Download,
  FileText,
  FileSpreadsheet,
  FileIcon as FilePdf,
} from "lucide-react"

type CloudFile = {
  id: string
  name: string
  type: string
  size: string
  modified: string
  path: string
  icon: React.ReactNode
}

type CloudFolder = {
  id: string
  name: string
  path: string
}

export function CloudFileBrowser() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("google-drive")
  const [currentPath, setCurrentPath] = useState("/")
  const [breadcrumbs, setBreadcrumbs] = useState<CloudFolder[]>([{ id: "root", name: "My Drive", path: "/" }])
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for demonstration
  const [files, setFiles] = useState<CloudFile[]>([
    {
      id: "folder1",
      name: "RFP Documents",
      type: "folder",
      size: "--",
      modified: "15/04/2023",
      path: "/RFP Documents",
      icon: <FolderOpen className="h-5 w-5 text-amber-500" />,
    },
    {
      id: "folder2",
      name: "Templates",
      type: "folder",
      size: "--",
      modified: "22/03/2023",
      path: "/Templates",
      icon: <FolderOpen className="h-5 w-5 text-amber-500" />,
    },
    {
      id: "file1",
      name: "Project Requirements.docx",
      type: "docx",
      size: "245 KB",
      modified: "10/04/2023",
      path: "/Project Requirements.docx",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
    },
    {
      id: "file2",
      name: "Budget Estimation.xlsx",
      type: "xlsx",
      size: "128 KB",
      modified: "05/04/2023",
      path: "/Budget Estimation.xlsx",
      icon: <FileSpreadsheet className="h-5 w-5 text-green-600" />,
    },
    {
      id: "file3",
      name: "Client Presentation.pdf",
      type: "pdf",
      size: "3.2 MB",
      modified: "01/04/2023",
      path: "/Client Presentation.pdf",
      icon: <FilePdf className="h-5 w-5 text-red-600" />,
    },
  ])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCurrentPath("/")
    setBreadcrumbs([{ id: "root", name: "My Drive", path: "/" }])
    setSelectedFiles([])
  }

  const handleFolderClick = (folder: CloudFile) => {
    setCurrentPath(folder.path)
    setBreadcrumbs([
      ...breadcrumbs,
      {
        id: folder.id,
        name: folder.name,
        path: folder.path,
      },
    ])
    setSelectedFiles([])

    // In a real implementation, this would fetch folder contents
    // For this example, we'll simulate loading
    setIsLoading(true)
    setTimeout(() => {
      if (folder.name === "RFP Documents") {
        setFiles([
          {
            id: "rfp-file1",
            name: "Client RFP.pdf",
            type: "pdf",
            size: "4.5 MB",
            modified: "12/04/2023",
            path: `${folder.path}/Client RFP.pdf`,
            icon: <FilePdf className="h-5 w-5 text-red-600" />,
          },
          {
            id: "rfp-file2",
            name: "Technical Requirements.docx",
            type: "docx",
            size: "320 KB",
            modified: "14/04/2023",
            path: `${folder.path}/Technical Requirements.docx`,
            icon: <FileText className="h-5 w-5 text-blue-600" />,
          },
        ])
      } else if (folder.name === "Templates") {
        setFiles([
          {
            id: "template1",
            name: "Proposal Template.docx",
            type: "docx",
            size: "185 KB",
            modified: "20/03/2023",
            path: `${folder.path}/Proposal Template.docx`,
            icon: <FileText className="h-5 w-5 text-blue-600" />,
          },
          {
            id: "template2",
            name: "Deal Approval Template.pptx",
            type: "pptx",
            size: "2.1 MB",
            modified: "21/03/2023",
            path: `${folder.path}/Deal Approval Template.pptx`,
            icon: <File className="h-5 w-5 text-orange-600" />,
          },
        ])
      }
      setIsLoading(false)
    }, 800)
  }

  const handleBreadcrumbClick = (folder: CloudFolder, index: number) => {
    setCurrentPath(folder.path)
    setBreadcrumbs(breadcrumbs.slice(0, index + 1))
    setSelectedFiles([])

    // In a real implementation, this would fetch folder contents
    // For this example, we'll reset to root files if going back to root
    if (folder.path === "/") {
      setFiles([
        {
          id: "folder1",
          name: "RFP Documents",
          type: "folder",
          size: "--",
          modified: "15/04/2023",
          path: "/RFP Documents",
          icon: <FolderOpen className="h-5 w-5 text-amber-500" />,
        },
        {
          id: "folder2",
          name: "Templates",
          type: "folder",
          size: "--",
          modified: "22/03/2023",
          path: "/Templates",
          icon: <FolderOpen className="h-5 w-5 text-amber-500" />,
        },
        {
          id: "file1",
          name: "Project Requirements.docx",
          type: "docx",
          size: "245 KB",
          modified: "10/04/2023",
          path: "/Project Requirements.docx",
          icon: <FileText className="h-5 w-5 text-blue-600" />,
        },
        {
          id: "file2",
          name: "Budget Estimation.xlsx",
          type: "xlsx",
          size: "128 KB",
          modified: "05/04/2023",
          path: "/Budget Estimation.xlsx",
          icon: <FileSpreadsheet className="h-5 w-5 text-green-600" />,
        },
        {
          id: "file3",
          name: "Client Presentation.pdf",
          type: "pdf",
          size: "3.2 MB",
          modified: "01/04/2023",
          path: "/Client Presentation.pdf",
          icon: <FilePdf className="h-5 w-5 text-red-600" />,
        },
      ])
    }
  }

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles((prev) => (prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]))
  }

  const handleImport = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to import",
        variant: "destructive",
      })
      return
    }

    const selectedFileNames = selectedFiles
      .map((id) => files.find((file) => file.id === id)?.name)
      .filter(Boolean)
      .join(", ")

    toast({
      title: "Files imported successfully",
      description: `Imported: ${selectedFileNames}`,
    })

    // In a real implementation, this would trigger file import
    setSelectedFiles([])
  }

  const handleRefresh = () => {
    setIsLoading(true)

    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Refreshed",
        description: "File list has been updated",
      })
    }, 800)
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle>Cloud Files</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="google-drive">Google Drive</TabsTrigger>
            <TabsTrigger value="onedrive">OneDrive</TabsTrigger>
            <TabsTrigger value="dropbox">Dropbox</TabsTrigger>
          </TabsList>

          <div className="mb-4 flex items-center gap-2">
            <div className="flex items-center flex-1 overflow-x-auto whitespace-nowrap p-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => handleBreadcrumbClick(breadcrumbs[0], 0)}
                disabled={breadcrumbs.length === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>

              <div className="flex items-center">
                {breadcrumbs.map((folder, index) => (
                  <div key={folder.id} className="flex items-center">
                    {index > 0 && <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => handleBreadcrumbClick(folder, index)}
                    >
                      {folder.name}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Search files..." className="pl-8" />
            </div>
          </div>

          <div className="border rounded-md">
            <div className="grid grid-cols-12 gap-2 p-2 text-xs font-medium text-gray-500 border-b bg-gray-50">
              <div className="col-span-1"></div>
              <div className="col-span-5">Name</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-2">Modified</div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-500">Loading files...</span>
                </div>
              ) : files.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No files found in this location</div>
              ) : (
                files.map((file) => (
                  <div
                    key={file.id}
                    className={`grid grid-cols-12 gap-2 p-2 text-sm border-b hover:bg-gray-50 ${
                      selectedFiles.includes(file.id) ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="col-span-1 flex items-center justify-center">
                      {file.type !== "folder" && (
                        <Checkbox
                          checked={selectedFiles.includes(file.id)}
                          onCheckedChange={() => handleFileSelect(file.id)}
                        />
                      )}
                    </div>
                    <div
                      className="col-span-5 flex items-center gap-2 cursor-pointer"
                      onClick={() => (file.type === "folder" ? handleFolderClick(file) : handleFileSelect(file.id))}
                    >
                      {file.icon}
                      <span className="truncate">{file.name}</span>
                    </div>
                    <div className="col-span-2 flex items-center">
                      {file.type === "folder" ? "Folder" : file.type.toUpperCase()}
                    </div>
                    <div className="col-span-2 flex items-center">{file.size}</div>
                    <div className="col-span-2 flex items-center">{file.modified}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {selectedFiles.length} {selectedFiles.length === 1 ? "file" : "files"} selected
            </div>
            <Button onClick={handleImport} disabled={selectedFiles.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Import Selected
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

