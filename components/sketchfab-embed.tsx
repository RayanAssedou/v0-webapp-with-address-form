"use client"

import { useEffect, useRef } from "react"
import SketchfabStyles from "./sketchfab-styles"

export default function SketchfabEmbed() {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "SKETCHFAB_API_READY") {
        console.log("Sketchfab API ready")
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  return (
    <div ref={wrapperRef} className="sketchfab-embed-wrapper w-full h-full">
      <iframe
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
        src="https://sketchfab.com/models/620b1f7eff9e463dba4cf9a51e95621f/embed?ui_controls=0&ui_infos=0&ui_stop=0&autostart=1&transparent=1"
      />
      <SketchfabStyles />
    </div>
  )
}
