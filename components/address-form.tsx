"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

// Import icons individually
import { MapPin } from "lucide-react"
import { Search } from "lucide-react"

// Using OpenStreetMap and Leaflet for the map
export default function AddressForm({
  handleSubmit,
}: {
  handleSubmit: (formData: FormData) => Promise<void>
}) {
  const [address, setAddress] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string
    lat: number
    lon: number
  } | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  // Load Leaflet scripts dynamically
  useEffect(() => {
    if (typeof window !== "undefined" && !window.L) {
      const linkCSS = document.createElement("link")
      linkCSS.rel = "stylesheet"
      linkCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(linkCSS)

      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = () => setMapLoaded(true)
      document.head.appendChild(script)
    } else {
      setMapLoaded(true)
    }
  }, [])

  // Initialize map when Leaflet is loaded
  useEffect(() => {
    if (mapLoaded && mapRef.current && !mapInstanceRef.current) {
      const L = (window as any).L
      if (!L) return

      // Default to France
      const map = L.map(mapRef.current).setView([46.603354, 1.888334], 5)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      mapInstanceRef.current = map
    }
  }, [mapLoaded])

  // Update map when location is selected
  useEffect(() => {
    if (mapLoaded && mapInstanceRef.current && selectedLocation) {
      const L = (window as any).L
      if (!L) return

      const map = mapInstanceRef.current

      // Remove existing marker
      if (markerRef.current) {
        map.removeLayer(markerRef.current)
      }

      // Add new marker
      const marker = L.marker([selectedLocation.lat, selectedLocation.lon]).addTo(map)
      markerRef.current = marker

      // Center map on marker
      map.setView([selectedLocation.lat, selectedLocation.lon], 16)

      // Add popup with address
      marker.bindPopup(selectedLocation.address).openPopup()
    }
  }, [selectedLocation, mapLoaded])

  const searchAddress = async () => {
    if (!address.trim()) return

    setIsSearching(true)
    try {
      // Using Nominatim API (OpenStreetMap's free geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5`,
      )
      const data = await response.json()
      setSuggestions(data)
    } catch (error) {
      console.error("Error searching address:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const selectSuggestion = (suggestion: any) => {
    setSelectedLocation({
      address: suggestion.display_name,
      lat: Number.parseFloat(suggestion.lat),
      lon: Number.parseFloat(suggestion.lon),
    })
    setAddress(suggestion.display_name)
    setSuggestions([])
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="address">Enter your address</Label>
        <div className="flex gap-2">
          <Input
            id="address"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your full address"
            className="flex-1"
            required
          />
          <Button
            type="button"
            onClick={searchAddress}
            disabled={isSearching}
            className="bg-[#c4e86b] hover:bg-[#b3d85a] text-[#2c3e50]"
          >
            {isSearching ? "Searching..." : <Search className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {suggestions.length > 0 && (
        <Card className="p-2 max-h-60 overflow-y-auto">
          <ul className="divide-y">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="py-2 px-3 hover:bg-gray-100 cursor-pointer flex items-start gap-2"
                onClick={() => selectSuggestion(suggestion)}
              >
                <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{suggestion.display_name}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="border rounded-lg overflow-hidden">
        <div ref={mapRef} className="h-[400px] w-full"></div>
      </div>

      {/* Hidden fields to store coordinates */}
      <input type="hidden" name="latitude" value={selectedLocation?.lat || ""} />
      <input type="hidden" name="longitude" value={selectedLocation?.lon || ""} />

      <div className="flex justify-end">
        <Button type="submit" className="bg-[#c4e86b] hover:bg-[#b3d85a] text-[#2c3e50]" disabled={!selectedLocation}>
          Continue to Next Step
        </Button>
      </div>
    </form>
  )
}
