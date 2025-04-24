"use client"

import { useEffect, useRef } from "react"
import SketchfabStyles from "./sketchfab-styles"

interface SketchfabModelProps {
  modelId: string
  className?: string
}

export default function SketchfabModel({ modelId, className = "" }: SketchfabModelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Optionally, you can use the Sketchfab API to control the model
    const handleMessage = (event: MessageEvent) => {
      // Handle messages from the Sketchfab iframe if needed
      if (event.data && event.data.type === "SKETCHFAB_API_READY") {
        console.log("Sketchfab API ready")
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [modelId])

  return (
    <div className={`sketchfab-embed-wrapper w-full h-full ${className}`}>
      <iframe
        ref={iframeRef}
        title="Pbr"
        frameBorder="0"
        allowFullScreen
        mozallowfullscreen="true"
        webkitallowfullscreen="true"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        xr-spatial-tracking="true"
        execution-while-out-of-viewport="true"
        execution-while-not-rendered="true"
        web-share="true"
        width="100%"
        height="100%"
        src={`https://sketchfab.com/models/${modelId}/embed?ui_controls=0&ui_infos=0&ui_stop=0&autostart=1&transparent=1`}
      />
      <SketchfabStyles />
    </div>
  )
}
