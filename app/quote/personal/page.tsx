import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import StepIndicator from "@/components/step-indicator"
import PersonalInfoForm from "@/components/personal-info-form"
import { generateQuoteId, processQuoteRequest } from "@/lib/solar-agent"
import QuoteHeader from "@/components/quote-header"

export default function PersonalInfoPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Ensure we have the data from previous steps
  const address = searchParams.address as string
  const latitude = searchParams.latitude as string
  const longitude = searchParams.longitude as string

  if (!address || !latitude || !longitude) {
    redirect("/quote/address")
  }

  async function handlePersonalInfoSubmit(formData: FormData) {
    "use server"

    try {
      // Process personal information
      const firstName = formData.get("firstName") as string
      const lastName = formData.get("lastName") as string
      const email = formData.get("email") as string
      const phone = formData.get("phone") as string
      const consent = formData.get("consent") === "on"

      if (!consent) {
        return { success: false, error: "You must consent to receive your quote analysis" }
      }

      // Generate a unique quote ID
      const quoteId = generateQuoteId()

      // Process the quote request (this would trigger the Python script in production)
      await processQuoteRequest({
        quoteId,
        address,
        location: { latitude: Number(latitude), longitude: Number(longitude) },
        personalInfo: { firstName, lastName, email, phone },
      })

      return { success: true, quoteId }
    } catch (error) {
      console.error("Error processing quote request:", error)
      return { success: false, error: "Failed to process your request" }
    }
  }

  return (
    <>
      <QuoteHeader />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#c3e86d] to-[#a9d84b] text-[#2c3e50] rounded-t-lg">
              <CardTitle className="text-3xl font-bold">Step 3: Personal Information</CardTitle>
              <CardDescription className="text-[#2c3e50]/80">
                Provide your contact details to receive your personalized quote
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <StepIndicator currentStep={3} totalSteps={3} />
              <PersonalInfoForm handleSubmit={handlePersonalInfoSubmit} />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
