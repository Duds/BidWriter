import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const PROJECT_PATH = process.env.PROJECT_PATH || path.join(process.cwd(), "projects")

export async function GET(request: Request, { params }: { params: { project: string } }) {
  try {
    const { project } = params
    const templatesPath = path.join(PROJECT_PATH, project, "Templates")

    if (!fs.existsSync(templatesPath)) {
      return NextResponse.json({ available: false, count: 0, templates: [] })
    }

    const templates = fs
      .readdirSync(templatesPath)
      .filter((file) => {
        const ext = path.extname(file).toLowerCase()
        return ext === ".docx" || ext === ".pptx"
      })
      .map((file) => ({
        name: file,
        type: path.extname(file).toLowerCase() === ".docx" ? "docx" : "pptx",
        path: path.join("Templates", file),
      }))

    return NextResponse.json({
      available: templates.length > 0,
      count: templates.length,
      templates,
    })
  } catch (error) {
    console.error("Error fetching templates:", error)
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
  }
}

