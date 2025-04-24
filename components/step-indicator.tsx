export default function StepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number
  totalSteps: number
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`
              w-10 h-10 rounded-full flex items-center justify-center
              ${
                index + 1 === currentStep
                  ? "bg-[#c4e86b] text-[#2c3e50]"
                  : index + 1 < currentStep
                    ? "bg-[#a99375] text-white"
                    : "bg-gray-200 text-gray-500"
              }
            `}
            >
              {index + 1 < currentStep ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span
              className={`
              mt-2 text-sm font-medium
              ${
                index + 1 === currentStep
                  ? "text-[#2c3e50]"
                  : index + 1 < currentStep
                    ? "text-[#a99375]"
                    : "text-gray-500"
              }
            `}
            >
              {index === 0 ? "Address" : index === 1 ? "Upload" : "Personal Info"}
            </span>
          </div>
        ))}
      </div>

      <div className="relative mt-2">
        <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
        <div
          className="absolute top-0 left-0 h-1 bg-[#c4e86b] transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}
