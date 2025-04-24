import Link from "next/link"
import FaqAccordion from "@/components/faq-accordion"
import SketchfabModel from "@/components/sketchfab-model"
import { startQuote } from "./actions"

// Import icons individually to avoid bundling issues
import { Sun } from "lucide-react"
import { ChevronDown } from "lucide-react"
import { CircleDot } from "lucide-react"
import { Wind } from "lucide-react"
import { Droplet } from "lucide-react"
import { Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <div className="w-full mx-auto">
        <div className="bg-white">
          {/* Header */}
          <header className="flex justify-between items-center p-4 md:p-5 bg-transparent absolute top-0 left-0 right-0 z-10 w-full">
            <Link href="/" className="flex items-center gap-2.5 text-white font-bold text-xl no-underline">
              <Sun className="text-[#64b5f6]" />
              SOLAR BRIGHT
            </Link>

            <Link
              href="#"
              className="py-2 px-4 md:px-6 bg-transparent border border-[#64b5f6] text-[#64b5f6] rounded-md font-semibold no-underline text-sm md:text-base"
            >
              CONTACT US
            </Link>
          </header>

          {/* Hero Section - Updated with Sketchfab model */}
          <section className="bg-gradient-to-r from-[#2c3e50] to-[#4a6583] p-6 md:p-[60px_40px] relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between w-full min-h-[600px]">
            <div className="w-full md:w-1/2 z-[2] mb-8 md:mb-0">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 leading-tight">
                Votre <span className="text-[#64b5f6]">Agent IA Solaire</span> Compare et Analyse Vos Devis{" "}
                <span className="text-[#64b5f6]">en Quelques Secondes</span>
              </h1>

              <p className="text-lg md:text-xl mb-8 max-w-2xl text-gray-100">Agent Solaire Intelligent</p>

              <div className="flex gap-4 mt-6 md:mt-8">
                <form action={startQuote}>
                  <button
                    type="submit"
                    className="py-3 px-8 bg-[#64b5f6] border-none text-[#2c3e50] rounded-md font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#90caf9] hover:shadow-lg"
                  >
                    COMMENCER
                  </button>
                </form>
              </div>
            </div>

            {/* Sketchfab Model */}
            <div className="w-full md:w-1/2 h-[400px] md:h-[500px] z-[2] relative">
              <SketchfabModel modelId="620b1f7eff9e463dba4cf9a51e95621f" />
            </div>

            {/* Abstract background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-[1] opacity-20">
              <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-[#64b5f6] blur-3xl"></div>
              <div className="absolute bottom-[10%] right-[5%] w-80 h-80 rounded-full bg-[#90caf9] blur-3xl"></div>
            </div>

            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-white opacity-70">
              <ChevronDown className="animate-bounce" />
            </div>
          </section>

          {/* Call-to-Action Section */}
          <section className="py-12 md:py-16 px-4 md:px-[40px] bg-gradient-to-r from-[#64b5f6]/10 to-[#90caf9]/10 w-full">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                <div className="w-full md:w-3/5">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#2c3e50] mb-4">
                    Économisez jusqu'à <span className="text-[#64b5f6]">30%</span> sur votre installation solaire
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Notre comparateur intelligent analyse vos besoins énergétiques et vous propose les meilleures offres
                    du marché, personnalisées pour votre habitation.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Comparaison instantanée de plusieurs installateurs",
                      "Analyse détaillée des devis et des équipements",
                      "Estimation précise de votre retour sur investissement",
                      "Accompagnement personnalisé par nos experts",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="mr-3 mt-1 bg-[#64b5f6] rounded-full p-1 text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-full md:w-2/5 bg-white rounded-xl shadow-lg p-6 md:p-8">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#64b5f6]/20 mb-4">
                      <Sun className="h-8 w-8 text-[#64b5f6]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2c3e50]">Obtenez votre comparatif gratuit</h3>
                    <p className="text-gray-500 mt-2">En seulement 3 minutes</p>
                  </div>

                  <form action={startQuote} className="space-y-4">
                    <button
                      type="submit"
                      className="w-full py-3 px-8 bg-[#64b5f6] text-white rounded-md font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#90caf9] hover:shadow-lg flex items-center justify-center"
                    >
                      <span>COMPARER MES DEVIS</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </form>

                  <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                    <p>Déjà plus de 10 000 foyers nous font confiance</p>
                    <div className="flex justify-center items-center mt-3">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-yellow-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Rest of the page content remains the same */}
          {/* About Section */}
          <section className="py-10 md:py-[60px] px-4 md:px-[40px] flex flex-col md:flex-row gap-6 md:gap-10 w-full">
            <div className="w-full md:w-[30%]">
              <h2 className="text-2xl md:text-3xl text-[#2c3e50]">Un choix gagnant à tous les niveaux.</h2>
            </div>

            <div className="w-full md:w-[70%] text-[#555] leading-relaxed">
              <p>
                Grâce aux panneaux solaires, dites adieu aux factures qui s&apos;envolent. Réduisez jusqu&apos;à 70 %
                vos dépenses, valorisez votre bien immobilier et revendez le surplus d&apos;énergie produite. Une
                solution intelligente, écologique et rapidement rentable.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8 md:mt-10">
                <div className="rounded-2xl overflow-hidden bg-[#2c3e50] text-white p-6 flex flex-col justify-center h-[250px] md:h-[300px]">
                  <div className="text-5xl font-bold mb-2.5">
                    70<span className="text-3xl">%</span>
                  </div>
                  <div className="text-sm opacity-90">d'économies en moyenne sur vos factures</div>
                </div>

                <div className="rounded-2xl overflow-hidden bg-[#4a6583] text-white flex flex-col items-center justify-center p-6 h-[250px] md:h-[300px]">
                  <div className="text-sm mb-4">Reprenez le pouvoir sur votre consommation</div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {[...Array(21)].map((_, i) => (
                      <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#64b5f6]"></div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden bg-[#e8f4ff] h-[250px] md:h-[300px] flex flex-col sm:col-span-2 md:col-span-1">
                  <div className="rounded-xl overflow-hidden m-2 flex-grow">
                    <img
                      src="/images/solar-panels-desert.png"
                      alt="Solar panels in desert with flowers"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 text-center text-[#2c3e50] font-medium">
                    Des panneaux solaires efficaces, durables et esthétiques
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-10 md:py-[60px] px-4 md:px-[40px] bg-[#f5f5f0] w-full">
            <h2 className="text-2xl md:text-3xl text-[#2c3e50] mb-4 md:mb-8">FAQ</h2>
            <p className="mb-6 md:mb-8 text-[#555]">Agent Solaire Intelligent</p>

            <FaqAccordion />
          </section>

          {/* Clean Energy Section */}
          <section className="p-4 md:p-10 relative w-full">
            <div
              className="rounded-2xl overflow-hidden relative h-[350px] md:h-[400px] bg-gradient-to-b from-black/20 to-black/70 bg-cover bg-center text-white p-6 md:p-[60px_40px] w-full"
              style={{ backgroundImage: "url('/images/wind-turbine-sunset.png')" }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 leading-tight">
                Power your future
                <br />
                with clean energy
              </h2>

              {/* Add the START YOUR FREE QUOTE button here */}
              <form action={startQuote}>
                <button
                  type="submit"
                  className="py-3 px-8 bg-[#64b5f6] border-none text-[#2c3e50] rounded-md font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#90caf9] hover:shadow-lg mt-6"
                >
                  START YOUR FREE QUOTE
                </button>
              </form>

              <div className="flex flex-wrap gap-3 md:gap-5 mt-6 md:mt-10">
                <div className="bg-white/10 backdrop-blur-md py-2 px-4 rounded-md flex items-center text-xs md:text-sm">
                  <Zap className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                  Energy Savings
                </div>

                <div className="bg-white/10 backdrop-blur-md py-2 px-4 rounded-md flex items-center text-xs md:text-sm">
                  <Sun className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                  Eco Energy
                </div>

                <div className="bg-white/10 backdrop-blur-md py-2 px-4 rounded-md flex items-center text-xs md:text-sm">
                  <CircleDot className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                  Battery
                </div>

                <div className="bg-white/10 backdrop-blur-md py-2 px-4 rounded-md flex items-center text-xs md:text-sm">
                  <Droplet className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                  Solar Panels
                </div>

                <div className="bg-white/10 backdrop-blur-md py-2 px-4 rounded-md flex items-center text-xs md:text-sm">
                  <Wind className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                  Wind Energy
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
