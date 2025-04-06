import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

const PROJECT_PATH = process.env.PROJECT_PATH || path.join(process.cwd(), "projects")

export async function GET(request: Request, { params }: { params: { project: string } }) {
  try {
    const { project } = params
    const outputsPath = path.join(PROJECT_PATH, project, "Outputs")

    if (!fs.existsSync(outputsPath)) {
      return NextResponse.json({ outputs: [] })
    }

    const outputs = fs
      .readdirSync(outputsPath)
      .filter((file) => {
        const ext = path.extname(file).toLowerCase()
        return ext === ".docx" || ext === ".pptx"
      })
      .map((file) => {
        const filePath = path.join(outputsPath, file)
        const stats = fs.statSync(filePath)

        let type: "proposal" | "deal" | "summary" = "proposal"
        if (file.toLowerCase().includes("deal")) type = "deal"
        else if (file.toLowerCase().includes("summary")) type = "summary"

        return {
          id: uuidv4(),
          name: file,
          type,
          path: path.join(project, "Outputs", file),
          createdAt: stats.birthtime.toISOString(),
          size: stats.size,
        }
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ outputs })
  } catch (error) {
    console.error("Error fetching outputs:", error)
    return NextResponse.json({ error: "Failed to fetch outputs" }, { status: 500 })
  }
}

