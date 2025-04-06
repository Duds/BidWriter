import type { NextRequest } from "next/server"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import OpenAI from "openai"
import { DocumentProcessor } from "@/lib/document-processor"
import { TemplateManager } from "@/lib/template-manager"
import { MarkdownConverter } from "@/lib/markdown-converter"

const PROJECT_PATH = process.env.PROJECT_PATH || path.join(process.cwd(), "projects")
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ""

export async function GET(request: NextRequest, { params }: { params: { project: string; type: string } }) {
  const { project, type } = params

  // Validate process type
  if (!["proposal", "deal", "summary"].includes(type)) {
    return new Response(JSON.stringify({ error: "Invalid process type" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Set up SSE response
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial message
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            documentProcessing: 0,
            aiAnalysis: 0,
            finalAssembly: 0,
            message: `Starting ${type} generation...`,
          })}\n\n`,
        ),
      )

      try {
        // Initialize OpenAI client
        const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

        // Initialize document processor
        const processor = new DocumentProcessor(PROJECT_PATH, project)

        // Update progress - Document processing started
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              documentProcessing: 10,
              message: "Processing RFP documents...",
            })}\n\n`,
          ),
        )

        // Process RFP documents
        const rfpText = await processor.processFolder()

        // Update progress - Document processing complete
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              documentProcessing: 100,
              aiAnalysis: 10,
              message: "Analyzing content with AI...",
            })}\n\n`,
          ),
        )

        // Determine template path based on process type
        let templateFileName = "Proposal_Template.docx"
        if (type === "deal") templateFileName = "Deal_approval_Template.pptx"
        else if (type === "summary") templateFileName = "Summary_Template.docx"

        const templatePath = path.join(PROJECT_PATH, project, "Templates", templateFileName)

        if (!fs.existsSync(templatePath)) {
          throw new Error(`Template not found: ${templateFileName}`)
        }

        // Generate system prompt based on process type
        const systemPrompt = await processor.loadSystemPrompt(type)

        // Generate template structure
        let templateStructure = ""
        if (type === "proposal" || type === "summary") {
          const templateManager = new TemplateManager(templatePath)
          templateStructure = templateManager.extractPlaceholders().join("\n")
        }

        // Update progress - AI processing
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              aiAnalysis: 30,
              message: "Generating content with AI...",
            })}\n\n`,
          ),
        )

        // Generate content with OpenAI
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `RFP CONTENT:\n${rfpText}\n\nTEMPLATE STRUCTURE:\n${templateStructure}` },
          ],
          temperature: 0.3,
          max_tokens: 16384,
        })

        const llmResponse = completion.choices[0].message.content || ""

        // Update progress - AI processing complete
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              aiAnalysis: 100,
              finalAssembly: 10,
              message: "Structuring content...",
            })}\n\n`,
          ),
        )

        // Parse response
        const content = processor.parseResponse(llmResponse)

        // Update progress - Final assembly
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              finalAssembly: 50,
              message: "Generating final document...",
            })}\n\n`,
          ),
        )

        // Generate output file
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
        const outputDir = path.join(PROJECT_PATH, project, "Outputs")

        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true })
        }

        let outputPath = ""
        let outputFile = ""

        if (type === "proposal") {
          outputFile = `Bid_Proposal_${timestamp}.docx`
          outputPath = path.join(outputDir, outputFile)

          const templateManager = new TemplateManager(templatePath)
          await templateManager.renderTemplate(content, outputPath)

          // Convert markdown in DOCX
          const converter = new MarkdownConverter(outputPath)
          await converter.convert()
        } else if (type === "deal") {
          outputFile = `Deal_Approval_${timestamp}.pptx`
          outputPath = path.join(outputDir, outputFile)

          await processor.renderPptxTemplate(templatePath, content, outputPath)
        } else if (type === "summary") {
          outputFile = `Executive_Summary_${timestamp}.docx`
          outputPath = path.join(outputDir, outputFile)

          const templateManager = new TemplateManager(templatePath)
          await templateManager.renderTemplate(content, outputPath)

          // Convert markdown in DOCX
          const converter = new MarkdownConverter(outputPath)
          await converter.convert()
        }

        // Update progress - Complete
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              finalAssembly: 100,
              message: "Process completed successfully",
            })}\n\n`,
          ),
        )

        // Create result object
        const stats = fs.statSync(outputPath)
        const result = {
          id: uuidv4(),
          name: outputFile,
          type,
          path: path.join(project, "Outputs", outputFile),
          createdAt: stats.birthtime.toISOString(),
          size: stats.size,
        }

        // Send completion event
        controller.enqueue(encoder.encode(`event: complete\ndata: ${JSON.stringify({ result })}\n\n`))
      } catch (error) {
        console.error(`Error in ${type} process:`, error)
        controller.enqueue(
          encoder.encode(
            `event: error\ndata: ${JSON.stringify({
              error: error instanceof Error ? error.message : "Unknown error occurred",
            })}\n\n`,
          ),
        )
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

