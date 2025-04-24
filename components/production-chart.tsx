"use client"

import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

// Define the months for the x-axis
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

interface ProductionChartProps {
  data: Record<string, number>
  showConsumption?: boolean
  consumption?: number
  isCumulative?: boolean
}

export default function ProductionChart({
  data,
  showConsumption = false,
  consumption = 0,
  isCumulative = false,
}: ProductionChartProps) {
  // Convert the data to the format expected by Chart.js
  const monthlyData = months.map((_, index) => data[(index + 1).toString()] || 0)

  // Calculate monthly consumption (distribute annual consumption evenly)
  const monthlyConsumption = showConsumption && consumption ? Array(12).fill(consumption / 12) : []

  // Determine chart type based on props
  const ChartComponent = isCumulative ? Line : Bar

  // Create appropriate chart data
  const chartData = {
    labels: months,
    datasets: [
      {
        label: isCumulative ? "Cumulative Production (kWh)" : "Monthly Production (kWh)",
        data: monthlyData,
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
        ...(isCumulative && { fill: false, tension: 0.1 }),
      },
      ...(showConsumption
        ? [
            {
              label: "Monthly Consumption (kWh)",
              data: monthlyConsumption,
              backgroundColor: "rgba(239, 68, 68, 0.6)",
              borderColor: "rgb(239, 68, 68)",
              borderWidth: 1,
              ...(isCumulative && { fill: false, tension: 0.1 }),
            },
          ]
        : []),
    ],
  }

  const options: ChartOptions<"bar" | "line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y.toLocaleString()} kWh`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Energy (kWh)",
        },
      },
    },
  }

  return <ChartComponent data={chartData} options={options} />
}
