"use client"

import type React from "react"

import { useState, useRef, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

// Import icons individually
import { FileText } from "lucide-react"
import { Upload } from "lucide-react"
import { X } from "lucide-react"
import { File } from "lucide-react"
import { ImageIcon } from "lucide-react"

export default function FileUploadForm({
  handleSubmit,
}: {
  handleSubmit: (formData: FormData) => Promise<void>
}) {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file: File) => {
    const type = file.type
    if (type.includes("pdf")) {
      return <FileText className="h-8 w-8 text-red-500" />
    } else if (type.includes("image")) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />
    } else {
      return <File className="h-8 w-8 text-gray-500" />
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()

    files.forEach((file, index) => {
      formData.append(`file-${index}`, file)
    })

    // Use startTransition to handle the server action
    startTransition(async () => {
      try {
        // Get the current URL search params to preserve them
        const searchParams = new URLSearchParams(window.location.search)
        const address = searchParams.get("address") || ""
        const latitude = searchParams.get("latitude") || ""
        const longitude = searchParams.get("longitude") || ""

        // Manually navigate to the next page instead of relying on redirect()
        await handleSubmit(formData)
        router.push(
          `/quote/personal?address=${encodeURIComponent(address)}&latitude=${latitude}&longitude=${longitude}`,
        )
      } catch (error) {
        console.error("Error submitting form:", error)
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center
          ${isDragging ? "border-[#c4e86b] bg-[#f5f5f0]" : "border-gray-300"}
          transition-colors duration-200
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Drag and drop your files here</h3>
        <p className="text-gray-500 mb-4">Upload your electricity bills or solar quotes as PDF or images</p>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="mx-auto border-[#c4e86b] text-[#2c3e50] hover:bg-[#f5f5f0]"
        >
          Browse Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </div>

      {files.length > 0 && (
        <Card className="p-4">
          <h3 className="font-medium mb-3">Uploaded Files ({files.length})</h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-3">
                  {getFileIcon(file)}
                  <div>
                    <p className="font-medium truncate max-w-xs">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-5 w-5" />
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          className="border-[#6a7a8c] text-[#6a7a8c] hover:bg-[#f5f5f0]"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="bg-[#c4e86b] hover:bg-[#b3d85a] text-[#2c3e50]"
          disabled={files.length === 0 || isPending}
        >
          {isPending ? "Processing..." : "Continue to Next Step"}
        </Button>
      </div>
    </form>
  )
}
