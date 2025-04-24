import { type NextRequest, NextResponse } from "next/server"
import { runSolarAnalysis } from "@/lib/solar-agent"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract data from form
    const address = formData.get("address") as string
    const latitude = Number.parseFloat(formData.get("latitude") as string)
    const longitude = Number.parseFloat(formData.get("longitude") as string)
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string

    // Get files
    const files: File[] = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("file-") && value instanceof File) {
        files.push(value)
      }
    }

    // Run analysis
    const result = await runSolarAnalysis(address, latitude, longitude, files, { firstName, lastName, email, phone })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error in solar analysis:", error)
    return NextResponse.json({ success: false, error: "Failed to process solar analysis" }, { status: 500 })
  }
}
