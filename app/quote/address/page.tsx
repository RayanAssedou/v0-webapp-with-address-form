import { redirect } from "next/navigation"
import AddressForm from "@/components/address-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import StepIndicator from "@/components/step-indicator"
import QuoteHeader from "@/components/quote-header"

export default function AddressPage() {
  async function handleAddressSubmit(formData: FormData) {
    "use server"

    const address = formData.get("address") as string
    const latitude = formData.get("latitude") as string
    const longitude = formData.get("longitude") as string

    // Store in session or database
    // For simplicity, we'll use searchParams to pass data between steps
    const params = new URLSearchParams()
    params.set("address", address)
    params.set("latitude", latitude)
    params.set("longitude", longitude)

    redirect(`/quote/upload?${params.toString()}`)
  }

  return (
    <>
      <QuoteHeader />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#c3e86d] to-[#a9d84b] text-[#2c3e50] rounded-t-lg">
              <CardTitle className="text-3xl font-bold">Step 1: Confirm Your Address</CardTitle>
              <CardDescription className="text-[#2c3e50]/80">
                Enter your address and confirm its location on the map
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <StepIndicator currentStep={1} totalSteps={3} />
              <AddressForm handleSubmit={handleAddressSubmit} />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
