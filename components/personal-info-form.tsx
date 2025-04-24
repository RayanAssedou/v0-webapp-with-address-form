"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function PersonalInfoForm({
  handleSubmit,
}: {
  handleSubmit: (formData: FormData) => Promise<{ success: boolean; quoteId?: string }>
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await handleSubmit(formData)

      if (result.success && result.quoteId) {
        router.push(`/quote/results?id=${result.quoteId}`)
      } else {
        setError("Failed to submit your information. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again later.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" placeholder="Enter your first name" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" placeholder="Enter your last name" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" name="email" type="email" placeholder="Enter your email address" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" type="tel" placeholder="Enter your phone number" required />
        </div>
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox id="consent" name="consent" required />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="consent"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I consent to receive my solar quote analysis
          </label>
          <p className="text-sm text-muted-foreground">
            We'll email you your personalized solar quote and may contact you to discuss your results.
          </p>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

      <div className="bg-[#f5f5f0] border border-[#e8e3d3] rounded-lg p-4 text-[#2c3e50] mb-6">
        <h3 className="font-medium mb-2">How we'll use your information:</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Generate your personalized solar energy quote</li>
          <li>Contact you with your results and recommendations</li>
          <li>We never share your information with third parties without your consent</li>
        </ul>
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          className="border-[#6a7a8c] text-[#6a7a8c] hover:bg-[#f5f5f0]"
        >
          Back
        </Button>
        <Button type="submit" className="bg-[#c4e86b] hover:bg-[#b3d85a] text-[#2c3e50]" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Submit and Get Your Quote"}
        </Button>
      </div>
    </form>
  )
}
