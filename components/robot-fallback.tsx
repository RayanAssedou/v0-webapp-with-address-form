import { Cpu } from "lucide-react"

export default function RobotFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#c3e86d] rounded-xl p-6">
      <Cpu className="w-16 h-16 mb-4 text-[#2c3e50]" />
      <h3 className="text-xl font-bold text-[#2c3e50] mb-2">AI Solar Agent</h3>
      <p className="text-center text-[#2c3e50] max-w-xs">
        Our intelligent agent analyzes your energy needs and finds the perfect solar solution for your home.
      </p>
    </div>
  )
}
