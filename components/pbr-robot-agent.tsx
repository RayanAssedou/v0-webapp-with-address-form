"use client"

import { useState, useEffect } from "react"
import CssRobot from "./css-robot"
import dynamic from "next/dynamic"

// Dynamically import the 3D component with no SSR
const PBRRobotSimple = dynamic(() => import("./pbr-robot-simple"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] md:min-h-[400px] bg-[#c3e86d] rounded-xl relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-4 border-[#2c3e50] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  ),
})

export default function PBRRobotAgent() {
  const [isClient, setIsClient] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Only render on client side
  useEffect(() => {
    setIsClient(true)

    // Global error handler
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes("three")) {
        console.error("Three.js error detected:", event)
        setHasError(true)
      }
    }

    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("error", handleError)
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
      <PBRRobotSimple />
    </div>
  )
}
