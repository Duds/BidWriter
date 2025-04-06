import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ available: false, error: "API key not configured" })
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey })

    // Make a simple request to check if the API key works
    await openai.models.list()

    return NextResponse.json({ available: true })
  } catch (error) {
    console.error("OpenAI API check failed:", error)
    return NextResponse.json({
      available: false,
      error: "Failed to connect to OpenAI API",
    })
  }
}

