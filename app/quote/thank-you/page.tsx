import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import QuoteHeader from "@/components/quote-header"

export default function ThankYouPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const name = (searchParams.name as string) || "there"
  const quoteId = searchParams.quoteId as string

  return (
    <>
      <QuoteHeader />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg text-center">
            <CardHeader className="bg-gradient-to-r from-[#c3e86d] to-[#a9d84b] text-[#2c3e50] rounded-t-lg">
              <CardTitle className="text-3xl font-bold">Thank You!</CardTitle>
              <CardDescription className="text-[#2c3e50]/80 text-lg">
                Your solar quote request has been submitted
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-24 h-24 text-[#c4e86b]" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Hi {name}!</h2>
              <p className="text-lg mb-6">
                We've received your information and are generating your personalized solar energy quote comparison. Our
                team will analyze your data and send you detailed recommendations shortly.
              </p>
              <div className="bg-[#f8f8f5] p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-lg mb-2">What happens next?</h3>
                <ul className="text-left list-disc pl-6 space-y-2">
                  <li>Our AI will analyze your documents and location data</li>
                  <li>We'll generate a detailed solar energy production estimate</li>
                  <li>You'll receive a comparison of different solar installation options</li>
                  <li>A solar energy expert will contact you to discuss your options</li>
                </ul>
              </div>
              {quoteId && (
                <div className="mt-6">
                  <Link href={`/quote/results?id=${quoteId}`}>
                    <Button className="bg-[#c4e86b] hover:bg-[#b3d85a] text-[#2c3e50]">View Your Results</Button>
                  </Link>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center pb-8">
              <Link href="/">
                <Button variant="outline" className="border-[#6a7a8c] text-[#6a7a8c] hover:bg-[#f5f5f0]">
                  Return to Home
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  )
}
