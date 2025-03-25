"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Cookies from "js-cookie"

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
      const newSearches = [
        searchNumber,
        ...recentSearches.filter(item => item !== searchNumber)
      ].slice(0, 5) // Zachowaj ostatnie 5 wyszukiwań

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
    <div className="container mx-auto pt-24 pb-16 px-4 md:px-6">
      <h1 className="text-3xl md:text-4xl font-semibold text-center mb-8 glow-text text-white">
        Śledzenie Przesyłki
      </h1>
      
      <div className="max-w-3xl mx-auto bg-white/5 rounded-xl p-6 mb-10">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            type="text"
            placeholder="Wprowadź numer przesyłki..."
            className="flex-1 bg-white/5 border-white/10 focus:border-white/30 text-white"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            onClick={() => handleTracking()}
            disabled={isLoading}
            className="bg-white text-black hover:bg-white/90 min-w-[120px]"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
            {isLoading ? "Szukam..." : "Śledź"}
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-md mb-6">
            <p>{error}</p>
          </div>
        )}

        {recentSearches.length > 0 && (
          <div className="mt-4 mb-6">
            <p className="text-sm text-white/60 mb-2">Ostatnio wyszukiwane:</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((number) => (
                <button
                  key={number}
                  onClick={() => {
                    setTrackingNumber(number)
                    handleTracking(number)
                  }}
                  className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md text-white/80 transition-colors"
                >
                  {number}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}