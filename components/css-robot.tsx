"use client"

export default function CssRobot() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#c3e86d] overflow-hidden">
      <div className="relative w-64 h-64 animate-float-xy">
        {/* Panneau solaire */}
        <div className="absolute w-40 h-48 bg-blue-900 border-4 border-gray-600 rounded-sm left-0 top-1/2 -translate-y-1/2 transform -rotate-12 shadow-lg grid grid-cols-5 grid-rows-6 gap-px">
          {/* Cellules solaires */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="bg-blue-800 border border-blue-900 relative">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-1 h-1 bg-white/30 rounded-full absolute"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Corps du robot */}
        <div className="absolute w-32 h-40 bg-gray-300 rounded-lg left-1/2 top-1/2 -translate-x-1/4 -translate-y-1/2 shadow-lg">
          {/* Tête du robot */}
          <div className="absolute w-24 h-20 bg-gray-300 rounded-full -top-14 left-1/2 -translate-x-1/2 shadow-lg border-2 border-gray-400">
            {/* Visière du robot */}
            <div className="absolute w-16 h-10 bg-black rounded-full top-4 left-1/2 -translate-x-1/2 shadow-inner overflow-hidden">
              {/* Yeux lumineux */}
              <div className="absolute top-3 left-3 w-3 h-2 bg-green-500 rounded-full glow"></div>
              <div className="absolute top-3 right-3 w-3 h-2 bg-green-500 rounded-full glow"></div>
            </div>

            {/* Oreilles du robot */}
            <div className="absolute w-4 h-4 bg-gray-400 rounded-full -left-1 top-6"></div>
            <div className="absolute w-4 h-4 bg-gray-400 rounded-full -right-1 top-6"></div>
          </div>

          {/* Circuit visible dans le ventre */}
          <div className="absolute w-10 h-6 bg-green-500/30 top-14 left-1/2 -translate-x-1/2 border border-gray-500 overflow-hidden">
            <div className="grid grid-cols-5 grid-rows-3 gap-px w-full h-full">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="bg-green-600/20 border border-green-700/20"></div>
              ))}
            </div>
          </div>

          {/* Détails du torse */}
          <div className="absolute w-4 h-4 bg-gray-600 rounded-full top-6 left-1/2 -translate-x-1/2"></div>
          <div className="absolute w-4 h-4 bg-gray-600 rounded-full top-10 left-1/2 -translate-x-1/2"></div>

          {/* Bras */}
          <div className="absolute w-6 h-20 bg-gray-400 rounded-lg -left-8 top-4 origin-top-right animate-wave-left">
            <div className="absolute w-5 h-5 bg-gray-500 rounded-full top-0 left-1/2 -translate-x-1/2"></div>
            <div className="absolute w-5 h-5 bg-gray-500 rounded-full bottom-0 left-1/2 -translate-x-1/2"></div>
          </div>

          <div className="absolute w-6 h-20 bg-gray-400 rounded-lg -right-8 top-4 origin-top-left animate-wave-right">
            <div className="absolute w-5 h-5 bg-gray-500 rounded-full top-0 left-1/2 -translate-x-1/2"></div>
            <div className="absolute w-5 h-5 bg-gray-500 rounded-full bottom-0 left-1/2 -translate-x-1/2"></div>
          </div>

          {/* Mains */}
          <div className="absolute w-8 h-6 bg-gray-500 rounded-lg -left-10 top-24 flex justify-center items-center">
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-gray-600 rounded-full"></div>
              <div className="w-1 h-4 bg-gray-600 rounded-full"></div>
              <div className="w-1 h-4 bg-gray-600 rounded-full"></div>
            </div>
          </div>

          <div className="absolute w-8 h-6 bg-gray-500 rounded-lg -right-10 top-24 flex justify-center items-center">
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-gray-600 rounded-full"></div>
              <div className="w-1 h-4 bg-gray-600 rounded-full"></div>
              <div className="w-1 h-4 bg-gray-600 rounded-full"></div>
            </div>
          </div>

          {/* Jambes */}
          <div className="absolute w-8 h-16 bg-gray-400 rounded-lg bottom-0 left-4 -mb-16">
            <div className="absolute w-6 h-6 bg-gray-500 rounded-full top-6 left-1/2 -translate-x-1/2"></div>
          </div>
          <div className="absolute w-8 h-16 bg-gray-400 rounded-lg bottom-0 right-4 -mb-16">
            <div className="absolute w-6 h-6 bg-gray-500 rounded-full top-6 left-1/2 -translate-x-1/2"></div>
          </div>

          {/* Pieds */}
          <div className="absolute w-10 h-5 bg-gray-600 rounded-lg bottom-0 left-3 -mb-20"></div>
          <div className="absolute w-10 h-5 bg-gray-600 rounded-lg bottom-0 right-3 -mb-20"></div>
        </div>

        {/* Document dans la main droite */}
        <div className="absolute w-12 h-16 bg-white right-0 top-1/2 -translate-y-1/4 transform rotate-6 shadow-md">
          <div className="w-full h-full p-1">
            <div className="w-full h-1 bg-gray-400 mb-1"></div>
            <div className="w-full h-1 bg-gray-400 mb-1"></div>
            <div className="w-full h-1 bg-gray-400 mb-1"></div>
            <div className="w-full h-1 bg-gray-400 mb-1"></div>
            <div className="w-full h-1 bg-gray-400 mb-1"></div>
            <div className="w-full h-1 bg-gray-400 mb-1"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glow {
          box-shadow: 0 0 10px 2px #4ade80;
          animation: glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes glow {
          from {
            box-shadow: 0 0 10px 2px #4ade80;
          }
          to {
            box-shadow: 0 0 20px 5px #4ade80;
          }
        }

        @keyframes float-xy {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-8px) translateX(5px);
          }
          50% {
            transform: translateY(0px) translateX(10px);
          }
          75% {
            transform: translateY(8px) translateX(5px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }

        @keyframes wave-left {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(15deg);
          }
        }

        @keyframes wave-right {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-15deg);
          }
        }

        .animate-float-xy {
          animation: float-xy 5s ease-in-out infinite;
        }

        .animate-wave-left {
          animation: wave-left 2s ease-in-out infinite;
        }

        .animate-wave-right {
          animation: wave-right 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
