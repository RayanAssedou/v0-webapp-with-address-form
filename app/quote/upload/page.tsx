import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import StepIndicator from "@/components/step-indicator"
import FileUploadForm from "@/components/file-upload-form"
import { redirect } from "next/navigation"
import QuoteHeader from "@/components/quote-header"

export default function UploadPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Ensure we have the address data from previous step
  const address = searchParams.address as string
  const latitude = searchParams.latitude as string
  const longitude = searchParams.longitude as string

  if (!address || !latitude || !longitude) {
    redirect("/quote/address")
  }

  async function handleFileSubmit(formData: FormData) {
    "use server"

    // Process file uploads
    // For simplicity, we'll just pass the form data to the next step
    // In a real app, you would store the files and pass references

    // Note: We're not using redirect here anymore
    // The client component will handle navigation
    return { success: true }
  }

  return (
    <>
      <QuoteHeader />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#c3e86d] to-[#a9d84b] text-[#2c3e50] rounded-t-lg">
              <CardTitle className="text-3xl font-bold">Step 2: Upload Documents</CardTitle>
              <CardDescription className="text-[#2c3e50]/80">
                Upload your electricity bills or solar quotes as PDF or images
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <StepIndicator currentStep={2} totalSteps={3} />
              <FileUploadForm handleSubmit={handleFileSubmit} />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
