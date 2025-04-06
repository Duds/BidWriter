import fs from "fs"
import path from "path"
import { promisify } from "util"
import { exec } from "child_process"

const execAsync = promisify(exec)

export class DocumentProcessor {
  private projectPath: string
  private bidFolder: string

  constructor(projectPath: string, bidFolder: string) {
    this.projectPath = projectPath
    this.bidFolder = bidFolder
  }

  private cleanText(text: string): string {
    return text.replace(/\s+/g, " ").trim()
  }

  async readPdf(filePath: string): Promise<string> {
    try {
      // Use pdfjs-dist to extract text from PDF
      // For simplicity in this example, we'll use a mock implementation
      // In a real implementation, you would use a PDF parsing library

      // Mock implementation
      return `Content extracted from ${path.basename(filePath)}`
    } catch (error) {
      console.error(`PDF read error: ${error}`)
      throw error
    }
  }

  async readDocx(filePath: string): Promise<string> {
    try {
      // Use mammoth or similar library to extract text from DOCX
      // For simplicity in this example, we'll use a mock implementation

      // Mock implementation
      return `Content extracted from ${path.basename(filePath)}`
    } catch (error) {
      console.error(`DOCX read error: ${error}`)
      throw error
    }
  }

  async processFolder(folderType = "RFP_Documents"): Promise<string> {
    let combinedText = ""
    const folderPath = path.join(this.projectPath, this.bidFolder, folderType)

    if (!fs.existsSync(folderPath)) {
      throw new Error(`Folder not found: ${folderPath}`)
    }

    const files = fs.readdirSync(folderPath)

    for (const fileName of files) {
      const filePath = path.join(folderPath, fileName)

      try {
        let text = ""

        if (fileName.endsWith(".pdf")) {
          text = await this.readPdf(filePath)
        } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
          text = await this.readDocx(filePath)
        } else {
          continue
        }

        combinedText += `\n\n[START OF ${fileName}]\n${text}\n[END OF ${fileName}]\n`
      } catch (error) {
        console.error(`Error processing ${fileName}: ${error}`)
        continue
      }
    }

    return combinedText
  }

  async loadSystemPrompt(mode = "proposal"): Promise<string> {
    const promptNames: Record<string, string> = {
      proposal: "system_prompt.txt",
      deal: "system_prompt_deal.txt",
      summary: "system_prompt_summary.txt",
    }

    const promptName = promptNames[mode] || "system_prompt.txt"
    const promptPath = path.join(this.projectPath, this.bidFolder, "Templates", promptName)

    // Check if prompt file exists
    if (!fs.existsSync(promptPath)) {
      // Create default prompt
      const defaultPrompt = this.createDefaultPrompt(mode)
      fs.writeFileSync(promptPath, defaultPrompt)
      return defaultPrompt
    }

    // Read prompt file
    return fs.readFileSync(promptPath, "utf-8")
  }

  createDefaultPrompt(mode: string): string {
    if (mode === "summary") {
      return `
VERSION: 1.0.0
LAST_MODIFIED: ${new Date().toISOString()}

ROLE: Executive Summary Specialist
COMPANY: Atturra
TASK: Generate concise and professional executive summaries for bid proposals

You are an expert in creating executive summaries for bid proposals. Your task is to analyze the provided RFP documents and generate a comprehensive executive summary that highlights the key points, requirements, and evaluation criteria.

Please structure your response according to the template provided, using markdown formatting for better readability.
`
    } else if (mode === "deal") {
      return `
VERSION: 1.0.0
LAST_MODIFIED: ${new Date().toISOString()}

ROLE: Deal Approval Specialist
COMPANY: Atturra
TASK: Analyze business opportunities and generate deal approval documents

You are an expert in analyzing business opportunities and creating deal approval documents. Your task is to review the provided RFP documents and generate a comprehensive deal approval presentation that outlines the opportunity, risks, and recommended approach.

Please structure your response according to the template provided, using markdown formatting for better readability.
`
    } else {
      return `
VERSION: 1.0.0
LAST_MODIFIED: ${new Date().toISOString()}

ROLE: Senior Bid Proposal Writer
COMPANY: Atturra
TASK: Analyze RFPs and generate comprehensive, professional bid proposals

You are an expert bid proposal writer for Atturra, a leading technology consulting firm. Your task is to analyze the provided RFP documents and generate a comprehensive, professional bid proposal that addresses all requirements and showcases Atturra's capabilities.

Please structure your response according to the template provided, using markdown formatting for better readability.
`
    }
  }

  parseResponse(responseText: string): Record<string, string> {
    const sections: Record<string, string> = {}
    let currentHeader: string | null = null
    const buffer: string[] = []

    const headerPattern = /^##\s+(?!##)(.+)$/gm

    // Split the text into lines
    const lines = responseText.split("\n")

    for (const line of lines) {
      const headerMatch = line.match(/^##\s+(?!##)(.+)$/)

      if (headerMatch) {
        // Save previous section if it exists
        if (currentHeader) {
          sections[currentHeader] = buffer.join("\n").trim()
        }

        // Start new section
        currentHeader = headerMatch[1].trim().toUpperCase()
        buffer.length = 0 // Clear buffer
      } else if (currentHeader) {
        buffer.push(line)
      }
    }

    // Save the last section
    if (currentHeader && buffer.length > 0) {
      sections[currentHeader] = buffer.join("\n").trim()
    }

    return sections
  }

  async renderPptxTemplate(templatePath: string, context: Record<string, string>, outputPath: string): Promise<void> {
    // In a real implementation, you would use a library like pptxgenjs
    // For this example, we'll create a simple mock implementation

    // Copy template to output path
    fs.copyFileSync(templatePath, outputPath)

    // Log the context for demonstration
    console.log("PPTX Template rendered with context:", Object.keys(context))

    return Promise.resolve()
  }
}

