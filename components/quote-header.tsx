import Link from "next/link"
import { Button } from "@/components/ui/button"

// Import icon individually
import { Sun } from "lucide-react"

export default function QuoteHeader() {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Sun className="h-6 w-6 text-[#c4e86b] mr-2" />
            <span className="font-bold text-xl">SOLAR BRIGHT</span>
          </Link>

          <Link href="/">
            <Button
              variant="outline"
              className="border-[#c4e86b] text-[#2c3e50] hover:bg-[#f5f5f0] hover:text-[#2c3e50]"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
