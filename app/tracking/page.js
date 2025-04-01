"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Cookies from "js-cookie"
import Navbar from "@/components/navbar"
export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recentSearches, setRecentSearches] = useState([])
  const router = useRouter()

  useEffect(() => {
    // Wczytaj ostatnie wyszukiwania z ciasteczek
    const savedSearches = Cookies.get("recentSearches")
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }
  }, [])

  const handleTracking = async (number = null) => {
    const searchNumber = number || trackingNumber.trim()

    if (!searchNumber) {
      setError("Wprowadź numer przesyłki")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Aktualizuj ostatnie wyszukiwania
      const newSearches = [searchNumber, ...recentSearches.filter((item) => item !== searchNumber)].slice(0, 5) // Zachowaj ostatnie 5 wyszukiwań

      setRecentSearches(newSearches)
      Cookies.set("recentSearches", JSON.stringify(newSearches), { expires: 30 })

      // Przekierowanie do strony śledzenia
      router.push(`/tracking/${encodeURIComponent(searchNumber)}`)
    } catch (error) {
      setError("Wystąpił błąd podczas wyszukiwania")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleTracking()
  }

  return (
    <div className="relative bg-[#0A0A0A] min-h-screen text-white selection:bg-rose-500/30 selection:text-white">
    <Navbar/>
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
       {/* Top gradient - bardziej miękkie przejścia */}
<div
  className="absolute top-0 left-0 w-full h-[70vh] bg-gradient-to-br from-rose-500/10 from-10% via-purple-500/[15%] via-40% to-transparent to-90%"
  style={{
    transform: "translate3d(0, 0, 0)",
    backfaceVisibility: "hidden",
    filter: "blur(20px)",
  }}
/>

{/* Bottom gradient - rozmyte krawędzie */}
<div
  className="absolute bottom-0 right-0 w-full h-[50vh] bg-gradient-to-tl from-purple-500/10 from-10% via-indigo-500/[15%] via-40% to-transparent to-90%"
  style={{
    transform: "translate3d(0, 0, 0)",
    backfaceVisibility: "hidden",
    filter: "blur(20px)",
  }}
/>

        {/* Animated particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-rose-500/5 blur-3xl animate-float-slow" />
          <div className="absolute top-3/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl animate-float-medium" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl animate-float-fast" />
        </div>
      </div>

      {/* Noise texture overlay */}
      <div className="fixed inset-0 bg-[url('/placeholder.svg?height=200&width=200')] opacity-[0.03] pointer-events-none z-10" />

      <div className="container mx-auto pt-24 pb-16 px-4 md:px-6 relative z-20">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-rose-400 drop-shadow-[0_0_25px_rgba(244,63,94,0.2)]">
            Śledzenie Przesyłki
          </span>
        </h1>

        <div className="max-w-3xl mx-auto bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-xl p-8 mb-10 border border-zinc-800/50 shadow-xl shadow-rose-500/5">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 text-rose-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Wprowadź numer przesyłki..."
                className="flex-1 pl-12 py-6 bg-zinc-800/50 border-zinc-700/50 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 rounded-xl text-white transition-all"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button
              onClick={() => handleTracking()}
              disabled={isLoading}
              className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white px-6 py-6 rounded-xl font-medium transition-all shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 min-w-[140px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Szukam...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Śledź
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-300 p-4 rounded-xl mb-6 backdrop-blur-sm">
              <p>{error}</p>
            </div>
          )}

          {recentSearches.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-white/60 mb-3 font-medium">Ostatnio wyszukiwane:</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((number) => (
                  <button
                    key={number}
                    onClick={() => {
                      setTrackingNumber(number)
                      handleTracking(number)
                    }}
                    className="text-sm bg-zinc-800/70 hover:bg-zinc-700/70 px-3 py-1.5 rounded-lg text-white/80 hover:text-white transition-all border border-zinc-700/50 hover:border-zinc-600/50"
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Informational section */}
        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Szybkie śledzenie",
                description: "Wprowadź numer przesyłki, aby natychmiast sprawdzić jej status i historię.",
              },
              {
                title: "Wiele przewoźników",
                description: "Obsługujemy przesyłki od różnych przewoźników w jednym miejscu.",
              },
              {
                title: "Historia wyszukiwań",
                description: "Łatwy dostęp do ostatnio wyszukiwanych numerów przesyłek.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-b from-zinc-800/30 to-zinc-900/30 backdrop-blur-sm rounded-xl p-6 border border-zinc-800/50 hover:translate-y-[-4px] transition-all duration-300"
              >
                <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-white/70 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes floatSlow {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-20px, 20px) rotate(5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        
        @keyframes floatMedium {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(30px, -20px) rotate(-5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        
        @keyframes floatFast {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-15px, -25px) rotate(7deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        
        .animate-float-slow {
          animation: floatSlow 20s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: floatMedium 15s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: floatFast 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

