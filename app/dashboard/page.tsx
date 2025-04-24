import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getUserQuotes } from "@/lib/solar-agent"
import QuotesList from "@/components/quotes-list"

export default async function DashboardPage() {
  // In a real app, you would get the user ID from the session
  // For demo purposes, we'll just get all quotes
  const quotes = await getUserQuotes()

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Solar Quotes</h1>
            <p className="text-gray-500 mt-1">Track and manage your solar energy quote requests</p>
          </div>
          <Link href="/quote/address">
            <Button className="bg-green-600 hover:bg-green-700">New Quote Request</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {quotes.length > 0 ? (
            <QuotesList quotes={quotes} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Quote Requests Yet</CardTitle>
                <CardDescription>Start by creating your first solar quote request</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center p-6">
                <p className="text-center mb-6 text-gray-500">
                  Get personalized solar installation recommendations in just 3 simple steps
                </p>
                <Link href="/quote/address">
                  <Button className="bg-green-600 hover:bg-green-700">Start Your First Quote</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
