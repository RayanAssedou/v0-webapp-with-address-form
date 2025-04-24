import { v4 as uuidv4 } from "uuid"
import { sendEmail } from "@/lib/email"

// Types for our solar analysis
export interface SolarAnalysisResult {
  quoteId: string
  timestamp: string
  systemSize: number
  production: {
    annual: number
    monthly: Record<string, number>
  }
  co2Reduction: number
  recommendations: {
    general: string[]
    technical: string[]
  }
  financial: {
    estimatedCost: number
    annualSavings: number
    paybackPeriod: number
  }
  quoteAnalysis: Array<{
    components: string
    priceAssessment: string
    guarantees: string
    missingElements: string
  }>
  visualizations: {
    productionChart: string
    cumulativeProduction: string
    productionVsConsumption: string
  }
}

export interface QuoteRequest {
  id: string
  address: string
  location: { latitude: number; longitude: number }
  personalInfo: { firstName: string; lastName: string; email: string; phone: string }
  status: "pending" | "processing" | "completed"
  createdAt: string
  updatedAt: string
  systemSize?: number
  annualProduction?: number
  co2Reduction?: number
  annualSavings?: number
  paybackPeriod?: number
}

// In-memory storage for demo purposes
// In production, this would be a database
const analysisResults = new Map<string, SolarAnalysisResult>()
const quoteRequests = new Map<string, QuoteRequest>()

// Generate a unique quote ID
export function generateQuoteId(): string {
  return uuidv4().substring(0, 8)
}

// Process a quote request
export async function processQuoteRequest({
  quoteId,
  address,
  location,
  personalInfo,
  files = [],
}: {
  quoteId: string
  address: string
  location: { latitude: number; longitude: number }
  personalInfo: { firstName: string; lastName: string; email: string; phone: string }
  files?: File[]
}): Promise<void> {
  // Create a quote request record
  const quoteRequest: QuoteRequest = {
    id: quoteId,
    address,
    location,
    personalInfo,
    status: "processing",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Store the quote request
  quoteRequests.set(quoteId, quoteRequest)

  // In a real implementation, this would:
  // 1. Store the files in a storage service
  // 2. Call the Python script with the necessary parameters
  // 3. Store the results in a database

  // For demonstration, we'll create mock data
  const mockResult = createMockAnalysisResult(quoteId, address, location, personalInfo)

  // Store the result
  analysisResults.set(quoteId, mockResult)

  // Update the quote request with the results
  quoteRequests.set(quoteId, {
    ...quoteRequest,
    status: "completed",
    updatedAt: new Date().toISOString(),
    systemSize: mockResult.systemSize,
    annualProduction: mockResult.production.annual,
    co2Reduction: mockResult.co2Reduction,
    annualSavings: mockResult.financial.annualSavings,
    paybackPeriod: mockResult.financial.paybackPeriod,
  })

  // Send an email notification
  await sendEmail({
    to: personalInfo.email,
    subject: "Your Solar Quote Analysis is Ready",
    body: `
      <h1>Hello ${personalInfo.firstName},</h1>
      <p>Your solar quote analysis is now ready to view.</p>
      <p>Click the button below to see your personalized solar energy recommendations:</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/quote/results?id=${quoteId}" style="display: inline-block; background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 16px;">View Your Analysis</a>
      <p>Thank you for using our service!</p>
    `,
  })
}

// Get the solar analysis results for a quote ID
export async function getSolarAnalysisResults(quoteId: string): Promise<SolarAnalysisResult | null> {
  // In a real implementation, this would fetch from a database
  return analysisResults.get(quoteId) || null
}

// Get all quote requests for a user
export async function getUserQuotes(userId?: string): Promise<QuoteRequest[]> {
  // In a real implementation, this would fetch from a database filtered by user ID
  // For demo purposes, we'll return all quotes
  return Array.from(quoteRequests.values())
}

// Create mock analysis result for demonstration
function createMockAnalysisResult(
  quoteId: string,
  address: string,
  location: { latitude: number; longitude: number },
  personalInfo: { firstName: string; lastName: string; email: string; phone: string },
): SolarAnalysisResult {
  // Calculate system size based on latitude (just for demo)
  const systemSize = 3 + Math.abs(location.latitude - 45) / 10

  // Calculate annual production based on system size
  const annualProduction = systemSize * 1100

  // Generate monthly production data
  const monthlyProduction: Record<string, number> = {
    "1": annualProduction * 0.05,
    "2": annualProduction * 0.06,
    "3": annualProduction * 0.08,
    "4": annualProduction * 0.1,
    "5": annualProduction * 0.12,
    "6": annualProduction * 0.13,
    "7": annualProduction * 0.13,
    "8": annualProduction * 0.12,
    "9": annualProduction * 0.09,
    "10": annualProduction * 0.06,
    "11": annualProduction * 0.04,
    "12": annualProduction * 0.03,
  }

  return {
    quoteId,
    timestamp: new Date().toISOString(),
    systemSize,
    production: {
      annual: annualProduction,
      monthly: monthlyProduction,
    },
    co2Reduction: annualProduction * 0.4, // 400g CO2 per kWh
    recommendations: {
      general: [
        `Based on your location at ${address}, a ${systemSize.toFixed(1)}kWp system would be optimal for your needs.`,
        "South-facing installation would maximize your energy production.",
        `Estimated annual production: ${Math.round(annualProduction)} kWh.`,
        "Consider adding battery storage to increase self-consumption.",
      ],
      technical: [
        "Use high-efficiency monocrystalline panels for better performance.",
        "Install a smart energy monitoring system to track production and consumption.",
        "Consider microinverters for better performance in partial shading conditions.",
      ],
    },
    financial: {
      estimatedCost: systemSize * 1500,
      annualSavings: annualProduction * 0.25, // 0.25€ per kWh
      paybackPeriod: 8,
    },
    quoteAnalysis: [
      {
        components:
          "The quote includes 10 premium monocrystalline panels (400W each) and a SolarEdge inverter with optimizers.",
        priceAssessment: "The price is competitive at 1.45€/Wp, which is below the market average of 1.60€/Wp.",
        guarantees: "25-year performance warranty on panels, 12-year product warranty, 10-year inverter warranty.",
        missingElements:
          "No monitoring system included. Consider requesting this addition for better system oversight.",
      },
    ],
    visualizations: {
      productionChart: "/placeholder.svg?height=300&width=500",
      cumulativeProduction: "/placeholder.svg?height=300&width=500",
      productionVsConsumption: "/placeholder.svg?height=300&width=500",
    },
  }
}

// In a real implementation, this function would execute the Python script
async function executePythonScript(params: {
  address: string
  latitude: number
  longitude: number
  puissanceKwc: number
  pertesSysteme: number
  pdfPaths: string[]
}): Promise<any> {
  // This is where you would execute the Python script
  // For example, using a serverless function or API call

  // Example implementation using child_process (for server environments only):
  /*
  const { spawn } = require('child_process');
  
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [
      'path/to/your/script.py',
      params.address,
      params.latitude.toString(),
      params.longitude.toString(),
      params.puissanceKwc.toString(),
      params.pertesSysteme.toString(),
      ...params.pdfPaths
    ]);
    
    let result = '';
    
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python script error: ${data}`);
    });
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const parsedResult = JSON.parse(result);
          resolve(parsedResult);
        } catch (error) {
          reject(new Error('Failed to parse Python script output'));
        }
      } else {
        reject(new Error(`Python script exited with code ${code}`));
      }
    });
  });
  */

  // For demonstration, return mock data
  return {
    analyse: {
      PVGIS: {
        inputs: {
          location: { latitude: params.latitude, longitude: params.longitude },
          pv_module: { peak_power: params.puissanceKwc },
        },
        outputs: {
          monthly: {
            fixed: Array.from({ length: 12 }, (_, i) => ({
              month: i + 1,
              E_m: 100 + (i < 6 ? i * 30 : (11 - i) * 30),
            })),
          },
          totals: {
            fixed: {
              E_y: params.puissanceKwc * 950,
            },
          },
        },
      },
      Database: [
        params.address,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        3500, // Annual consumption in kWh
      ],
      PDF_Contents: {},
    },
    visuels: {
      production_mensuelle: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      production_cumulee: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    },
    recommandations: {
      recommandation_générale:
        "Based on the analysis, a solar installation of " +
        params.puissanceKwc +
        " kWc would produce approximately " +
        params.puissanceKwc * 950 +
        " kWh per year. This would cover about " +
        Math.round(((params.puissanceKwc * 950) / 3500) * 100) +
        "% of your annual consumption.",
      recommandation_1: "The solar panels should be installed facing south for optimal production.",
    },
  }
}

export async function runSolarAnalysis(
  address: string,
  latitude: number,
  longitude: number,
  files: File[],
  personalInfo: { firstName: string; lastName: string; email: string; phone: string },
): Promise<any> {
  // Mock implementation for demonstration purposes
  // In a real application, this function would orchestrate the solar analysis process
  // including calling the Python script and storing the results.

  const puissanceKwc = 5 // Example value
  const pertesSysteme = 14 // Example value
  const pdfPaths: string[] = [] // Example value

  const params = {
    address,
    latitude,
    longitude,
    puissanceKwc,
    pertesSysteme,
    pdfPaths,
  }

  const analysisResult = await executePythonScript(params)

  // Simulate storing the analysis result
  console.log("Solar analysis completed:", analysisResult)

  return analysisResult
}
