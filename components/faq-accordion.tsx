"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

// Import icons individually
import { ChevronUp } from "lucide-react"
import { ChevronDown } from "lucide-react"

interface FaqItem {
  id: number
  title: string
  content: string
}

export default function FaqAccordion() {
  const [openItem, setOpenItem] = useState<number>(1)

  const faqItems: FaqItem[] = [
    {
      id: 1,
      title: "Est-ce que cet agent est gratuit ?",
      content:
        "✅ Oui, 100 % gratuit ! Vous pouvez poser toutes vos questions sur les panneaux solaires sans aucun frais.",
    },
    {
      id: 2,
      title: "Comment savoir si mon logement est compatible avec l'énergie solaire ?",
      content:
        "🌞 L'agent peut vous aider à évaluer rapidement l'exposition de votre toit, votre consommation, et la rentabilité potentielle. Il suffit de fournir quelques informations de base.",
    },
    {
      id: 3,
      title: "En combien de temps puis-je rentabiliser mon installation solaire ?",
      content:
        "📉 En général, entre 5 et 8 ans selon votre consommation et les aides disponibles. L'agent vous donne une estimation personnalisée en quelques clics.",
    },
    {
      id: 4,
      title: "Est-ce que je peux vendre le surplus d'électricité ?",
      content:
        "⚡ Oui ! Grâce à l'autoconsommation avec revente, vous pouvez revendre l'excédent non consommé à EDF OA ou un autre fournisseur.",
    },
    {
      id: 5,
      title: "Est-ce que l'entretien des panneaux est compliqué ?",
      content:
        "🧽 Pas du tout. L'agent vous explique comment assurer un bon entretien avec très peu d'effort, pour que vos panneaux durent 25 ans ou plus.",
    },
  ]

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? 0 : id)
  }

  return (
    <div className="space-y-4 w-full">
      {faqItems.map((item) => (
        <div
          key={item.id}
          className={cn(
            "rounded-2xl overflow-hidden transition-all duration-300 ease-in-out w-full",
            openItem === item.id ? "bg-[#2c3e50]" : "bg-[#e8f4ff]",
          )}
        >
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full flex items-center justify-between p-4 md:p-5 text-left focus:outline-none"
          >
            <span className="flex items-center">
              <span className="font-bold mr-2 md:mr-2.5 text-lg md:text-xl">{item.id}</span>
              <span
                className={cn(
                  "font-semibold text-lg md:text-xl",
                  openItem === item.id ? "text-white" : "text-[#2c3e50]",
                )}
              >
                {item.title}
              </span>
            </span>
            <div
              className={cn(
                "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors",
                openItem === item.id ? "bg-[#64b5f6]" : "bg-[#e8f4ff] border border-[#d0cbc0]",
              )}
            >
              {openItem === item.id ? (
                <ChevronUp className="h-4 w-4 md:h-5 md:w-5 text-[#2c3e50]" />
              ) : (
                <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-[#2c3e50]" />
              )}
            </div>
          </button>

          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              openItem === item.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
            )}
          >
            <div className="p-4 md:p-5 pt-0 pl-8 md:pl-12 border-l-4 border-[#64b5f6] ml-5 text-white">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
