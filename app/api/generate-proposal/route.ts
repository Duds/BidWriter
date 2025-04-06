import { NextResponse } from 'next/server'
import { DocumentProcessor } from '@/lib/document-processor'
import { generateResponse } from '@/lib/openai-client'
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { projectPath, bidFolder } = await request.json()

    // Validate folder structure
    const rfpFolderPath = path.join(projectPath, bidFolder, 'RFP_Documents')
    if (!fs.existsSync(rfpFolderPath)) {
      return NextResponse.json({ error: `Folder not found: ${rfpFolderPath}` }, { status: 404 })
    }

    // Step 1: Initialize DocumentProcessor
    const processor = new DocumentProcessor(projectPath, bidFolder)

    // Step 2: Process RFP documents
    const rfpContent = await processor.processFolder('RFP_Documents')

    // Step 3: Load system prompt
    const systemPrompt = await processor.loadSystemPrompt('proposal')

    // Step 4: Send content to OpenAI
    const openaiResponse = await generateResponse(`${systemPrompt}\n\n${rfpContent}`)

    // Step 5: Parse OpenAI response
    const parsedResponse = processor.parseResponse(openaiResponse)

    // Step 6: Return the parsed response
    return NextResponse.json({ parsedResponse })
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
  }
}
