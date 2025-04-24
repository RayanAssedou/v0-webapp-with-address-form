import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSolarAnalysisResults } from "@/lib/solar-agent"
import { formatNumber } from "@/lib/utils"
import ProductionChart from "@/components/production-chart"
import SolarSavingsChart from "@/components/solar-savings-chart"

// Import icons individually
import { Download } from "lucide-react"
import { Mail } from "lucide-react"
import { Share2 } from "lucide-react"

export default async function ResultsContent({ quoteId }: { quoteId: string }) {
  // Fetch the results using the quote ID
  const results = await getSolarAnalysisResults(quoteId)

  if (!results) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Analysis Not Found</h2>
        <p className="mb-6">We couldn't find the solar analysis results for this quote ID.</p>
        <Button asChild>
          <a href="/">Return to Home</a>
        </Button>
      </div>
    )
  }

  // Create a cumulative production chart data from monthly data
  const cumulativeData = { ...results.production.monthly }
  let cumulativeTotal = 0
  Object.keys(results.production.monthly).forEach((month) => {
    cumulativeTotal += results.production.monthly[month]
    cumulativeData[month] = cumulativeTotal
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Solar Analysis Results</h2>
          <p className="text-gray-500">Analysis completed on {new Date(results.timestamp).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Email Report
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Annual Production</h3>
            <p className="text-3xl font-bold text-green-600">{formatNumber(results.production.annual)} kWh</p>
            <p className="text-sm text-gray-500 mt-1">Estimated yearly energy production</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">System Size</h3>
            <p className="text-3xl font-bold text-green-600">{results.systemSize} kWp</p>
            <p className="text-sm text-gray-500 mt-1">Recommended solar system capacity</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">CO₂ Reduction</h3>
            <p className="text-3xl font-bold text-green-600">{formatNumber(results.co2Reduction)} kg</p>
            <p className="text-sm text-gray-500 mt-1">Annual carbon emissions saved</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="production">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="financial">Financial Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="production" className="pt-6">
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-lg font-medium mb-4">Monthly Production Estimate</h3>
              <div className="h-[400px]">
                <ProductionChart data={results.production.monthly} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="text-lg font-medium mb-4">Production vs. Consumption</h3>
                <div className="h-[300px] flex items-center justify-center">
                  {/* Remplacer l'image par un graphique généré dynamiquement */}
                  <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                    <ProductionChart
                      data={results.production.monthly}
                      showConsumption={true}
                      consumption={3500} // Valeur estimée de consommation annuelle
                    />
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="text-lg font-medium mb-4">Cumulative Production</h3>
                <div className="h-[300px] flex items-center justify-center">
                  {/* Remplacer l'image par un graphique généré dynamiquement */}
                  <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                    <ProductionChart data={cumulativeData} isCumulative={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="recommendations" className="pt-6">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-xl font-medium mb-4">System Recommendations</h3>
              <div className="space-y-4">
                {results.recommendations.general.map((rec, index) => (
                  <div key={index} className="p-4 bg-green-50 rounded-lg">
                    <p>{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-xl font-medium mb-4">Technical Recommendations</h3>
              <div className="space-y-4">
                {results.recommendations.technical.map((rec, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg">
                    <p>{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="financial" className="pt-6">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-xl font-medium mb-4">Financial Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium">Estimated Cost</h4>
                    <p className="text-2xl font-bold mt-2">€{formatNumber(results.financial.estimatedCost)}</p>
                    <p className="text-sm text-gray-500 mt-1">Initial investment</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium">Annual Savings</h4>
                    <p className="text-2xl font-bold mt-2">€{formatNumber(results.financial.annualSavings)}</p>
                    <p className="text-sm text-gray-500 mt-1">Yearly electricity savings</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium">Payback Period</h4>
                    <p className="text-2xl font-bold mt-2">{results.financial.paybackPeriod} years</p>
                    <p className="text-sm text-gray-500 mt-1">Return on investment</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-xl font-medium mb-4">Return on Investment</h3>
              <SolarSavingsChart
                initialCost={results.financial.estimatedCost}
                annualSavings={results.financial.annualSavings}
                years={25}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
