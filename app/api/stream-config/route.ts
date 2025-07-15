import { NextResponse } from "next/server"

export async function GET() {
  const apiKey = process.env.STREAM_API_KEY

  // Removed: TEMPORARY DEBUGGING log for API Key being sent

  if (!apiKey) {
    return NextResponse.json({ error: "Stream API Key not configured" }, { status: 500 })
  }

  return NextResponse.json({ apiKey })
}
