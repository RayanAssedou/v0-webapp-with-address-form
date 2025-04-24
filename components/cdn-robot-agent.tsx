"use client"

import { useState, useEffect } from "react"
import CssRobot from "./css-robot"
import dynamic from "next/dynamic"

// Dynamically import the CDN robot component with no SSR
const CDNRobotComponent = dynamic(() => import("./cdn-robot"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] md:min-h-[400px] bg-[#c3e86d] rounded-xl relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-4 border-[#2c3e50] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  ),
})

export default function CDNRobotAgent() {
  const [isClient, setIsClient] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Only render on client side
  useEffect(() => {
    setIsClient(true)

    // Global error handler
    const handleError = (event: ErrorEvent) => {
      console.error("Caught global error:", event)
      if (
        event.message &&
        (event.message.includes("three") || event.message.includes("THREE") || event.message.includes("script error"))
      ) {
        console.error("Three.js error detected:", event)
        setHasError(true)
      }
    }

    window.addEventListener("error", handleError)

    // Also listen for unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event)
      setHasError(true)
    }

    window.addEventListener("unhandledrejection", handleRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleRejection)
    }
  }, [])

  // Show CSS fallback if not client-side or if there's an error
  if (!isClient || hasError) {
    return (
      <div className="w-full h-full min-h-[300px] md:min-h-[400px] bg-[#c3e86d] rounded-xl relative overflow-hidden">
        <CssRobot />
      </div>
    )
  }

  // Show 3D robot
  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[400px] bg-[#c3e86d] rounded-xl relative overflow-hidden">
      <CDNRobotComponent />
    </div>
  )
}
