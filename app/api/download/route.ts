import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const PROJECT_PATH = process.env.PROJECT_PATH || path.join(process.cwd(), "projects")

export async function GET(request: NextRequest) {
  try {
    const filePath = request.nextUrl.searchParams.get("path")

    if (!filePath) {
      return NextResponse.json({ error: "File path is required" }, { status: 400 })
    }

    const fullPath = path.join(PROJECT_PATH, filePath)

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Read file
    const fileBuffer = fs.readFileSync(fullPath)
    const fileName = path.basename(fullPath)

    // Determine content type
    const ext = path.extname(fullPath).toLowerCase()
    let contentType = "application/octet-stream"

    if (ext === ".docx") {
      contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    } else if (ext === ".pptx") {
      contentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    }

    // Return file as response
    return new Response(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("Error downloading file:", error)
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 })
  }
}

