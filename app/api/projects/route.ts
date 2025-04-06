import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const PROJECT_PATH = process.env.PROJECT_PATH || path.join(process.cwd(), "projects")

export async function GET() {
  try {
    // Ensure the projects directory exists
    if (!fs.existsSync(PROJECT_PATH)) {
      fs.mkdirSync(PROJECT_PATH, { recursive: true })
    }

    // Get all directories in the projects folder
    const projects = fs
      .readdirSync(PROJECT_PATH, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 })
    }

    // Create project directory structure
    const projectPath = path.join(PROJECT_PATH, name)

    if (fs.existsSync(projectPath)) {
      return NextResponse.json({ error: "Project already exists" }, { status: 400 })
    }

    // Create project directory and subdirectories
    fs.mkdirSync(projectPath, { recursive: true })
    fs.mkdirSync(path.join(projectPath, "RFP_Documents"), { recursive: true })
    fs.mkdirSync(path.join(projectPath, "Templates"), { recursive: true })
    fs.mkdirSync(path.join(projectPath, "Outputs"), { recursive: true })

    return NextResponse.json({ success: true, project: name })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

