import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, MapPin } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { formatNumber } from "@/lib/utils"
import type { QuoteRequest } from "@/lib/solar-agent"

export default function QuotesList({ quotes }: { quotes: QuoteRequest[] }) {
  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <Card key={quote.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-6 md:col-span-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-lg mb-1">
                      {quote.address.split(",")[0]}
                      {quote.status === "completed" && (
                        <span className="text-green-600 ml-2">{quote.systemSize} kWp</span>
                      )}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="truncate">{quote.address}</span>
                    </div>
                  </div>
                  <Badge
                    className={
                      quote.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : quote.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                    }
                  >
                    {quote.status === "completed"
                      ? "Completed"
                      : quote.status === "processing"
                        ? "Processing"
                        : "Pending"}
                  </Badge>
                </div>

                <div className="flex items-center text-gray-500 text-sm mt-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Created {formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true })}</span>
                </div>
              </div>

              {quote.status === "completed" && (
                <div className="p-6 border-l border-t md:border-t-0 bg-gray-50 md:col-span-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Annual Production</p>
                      <p className="font-medium">{formatNumber(quote.annualProduction)} kWh</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">CO₂ Reduction</p>
                      <p className="font-medium">{formatNumber(quote.co2Reduction)} kg/year</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estimated Savings</p>
                      <p className="font-medium">€{formatNumber(quote.annualSavings)}/year</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payback Period</p>
                      <p className="font-medium">{quote.paybackPeriod} years</p>
                    </div>
                  </div>
                </div>
              )}

              {quote.status !== "completed" && (
                <div className="p-6 border-l border-t md:border-t-0 bg-gray-50 md:col-span-2 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">
                      {quote.status === "processing" ? "Your quote is being processed" : "Your quote is pending review"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {quote.status === "processing"
                        ? "This usually takes 5-10 minutes"
                        : "We'll start processing your quote soon"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t p-4 flex justify-end">
            <Link href={`/quote/results?id=${quote.id}`}>
              <Button variant="outline" size="sm" className="text-green-600 border-green-600">
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
