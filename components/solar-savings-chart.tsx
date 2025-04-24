"use client"

import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface SolarSavingsChartProps {
  initialCost: number
  annualSavings: number
  years: number
}

export default function SolarSavingsChart({ initialCost, annualSavings, years }: SolarSavingsChartProps) {
  const yearLabels = Array.from({ length: years + 1 }, (_, i) => i.toString())

  // Calculate cumulative savings over time
  const cumulativeSavings = yearLabels.map((_, i) => i * annualSavings)

  // Calculate net position (savings minus initial cost)
  const netPosition = cumulativeSavings.map((saving) => saving - initialCost)

  // Find break-even point (when net position becomes positive)
  const breakEvenYear = netPosition.findIndex((value) => value >= 0)

  const chartData = {
    labels: yearLabels,
    datasets: [
      {
        label: "Cumulative Savings",
        data: cumulativeSavings,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Net Position",
        data: netPosition,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Initial Investment",
        data: Array(years + 1).fill(initialCost),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
      },
    ],
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: €${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Amount (€)",
        },
        ticks: {
          callback: (value) => `€${value}`,
        },
      },
      x: {
        title: {
          display: true,
          text: "Years",
        },
      },
    },
  }

  return (
    <div className="space-y-4">
      <div className="h-[400px]">
        <Line data={chartData} options={options} />
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="font-medium">
          Break-even point:{" "}
          <span className="text-blue-700">{breakEvenYear > 0 ? `${breakEvenYear} years` : "Immediate payback"}</span>
        </p>
        <p className="text-sm text-gray-600 mt-1">
          After {breakEvenYear} years, your solar system will have paid for itself and will continue to generate savings
          for many more years.
        </p>
      </div>
    </div>
  )
}
