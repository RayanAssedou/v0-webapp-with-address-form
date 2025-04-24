import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ResultsContent from "@/components/results-content"
import ResultsLoading from "@/components/results-loading"
import QuoteHeader from "@/components/quote-header"

// This page will display the results of the solar analysis
export default function ResultsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const quoteId = searchParams.id as string

  if (!quoteId) {
    notFound()
  }

  return (
    <>
      <QuoteHeader />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#c3e86d] to-[#a9d84b] text-[#2c3e50] rounded-t-lg">
              <CardTitle className="text-3xl font-bold">Your Solar Energy Analysis</CardTitle>
              <CardDescription className="text-[#2c3e50]/80 text-lg">
                Personalized recommendations based on your location and energy needs
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Suspense fallback={<ResultsLoading />}>
                <ResultsContent quoteId={quoteId} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
