import Link from "next/link"
import { Sun } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#f8f8f5] border-t w-full">
      <div className="w-full px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center">
              <Sun className="h-6 w-6 text-[#c4e86b] mr-2" />
              <span className="font-bold text-xl">SOLAR BRIGHT</span>
            </Link>
            <p className="mt-2 text-gray-600">
              Harness the power of the sun and take control of your energy consumption with Solar Bright.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-[#c4e86b]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-[#c4e86b]">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/quote/address" className="text-gray-600 hover:text-[#c4e86b]">
                  Get a Quote
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-[#c4e86b]">
                  Solar Energy Guide
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-[#c4e86b]">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-[#c4e86b]">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-3">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">Email: info@solarbright.com</li>
              <li className="text-gray-600">Phone: +33 1 23 45 67 89</li>
              <li className="text-gray-600">Address: 123 Solar Street, Paris</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Solar Bright. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
