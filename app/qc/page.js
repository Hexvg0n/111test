"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Loader2, ExternalLink, Calendar, ImageIcon } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { cn } from "@/lib/utils"
import Navbar from "@/components/navbar"

export default function QCPage() {
  const searchParams = useSearchParams()
  const initialUrl = searchParams.get('url')
  
  const [url, setUrl] = useState(initialUrl || "")
  const [isLoading, setIsLoading] = useState(!!initialUrl)
  const [error, setError] = useState(null)
  const [qcData, setQcData] = useState(null)
  const [activeGroup, setActiveGroup] = useState(null)
  const [activePhoto, setActivePhoto] = useState(null)

  useEffect(() => {
    if (initialUrl) {
      handleSearch()
    }
  }, [])

  const handleSearch = async () => {
    if (!url.trim()) {
      setError("Wprowadź link do produktu")
      return
    }

    setIsLoading(true)
    setError(null)
    setQcData(null)
    setActiveGroup(null)
    setActivePhoto(null)

    try {
      const response = await fetch("/api/qcPhotos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok || data.status === "error") {
        throw new Error(data.message || "Wystąpił błąd podczas pobierania zdjęć QC")
      }

      if (data.data?.groups?.length > 0) {
        setQcData(data.data.groups)
        setActiveGroup(0)
        setActivePhoto(data.data.groups[0].photos[0])
      } else {
        setError("Nie znaleziono zdjęć QC dla tego produktu")
      }
    } catch (err) {
      setError(err.message || "Wystąpił nieoczekiwany błąd")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="relative bg-[#0A0A0A] min-h-screen text-white selection:bg-rose-500/30 selection:text-white">
    <Navbar/>

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
{/* Top gradient - bardziej miękkie przejścia */}
<div
  className="absolute top-0 left-0 w-full h-[70vh] bg-gradient-to-br from-rose-500/10 from-10% via-purple-500/5 via-40% to-transparent to-90%"
  style={{
    transform: "translate3d(0, 0, 0)",
    backfaceVisibility: "hidden",
    filter: "blur(20px)",
  }}
/>

{/* Bottom gradient - rozmyte krawędzie */}
<div
  className="absolute bottom-0 right-0 w-full h-[50vh] bg-gradient-to-tl from-purple-500/10 from-10% via-indigo-500/5 via-40% to-transparent to-90%"
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
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-rose-400 drop-shadow-[0_0_25px_rgba(244,63,94,0.2)]">
            Zdjęcia QC (Quality Control)
          </span>
        </h1>
        <p className="text-center mb-10 max-w-3xl mx-auto text-white/70">
          Wprowadź link do produktu, aby zobaczyć zdjęcia QC. Obsługiwane są linki z Taobao, Weidian, 1688 i Tmall.
        </p>

        <div className="max-w-3xl mx-auto bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-xl p-8 mb-10 border border-zinc-800/50 shadow-xl shadow-rose-500/5">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-rose-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Wklej link do produktu..."
                className="flex-1 pl-12 py-6 bg-zinc-800/50 border-zinc-700/50 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 rounded-xl text-white transition-all"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button
              onClick={handleSearch}
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
                  Szukaj
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-300 p-4 rounded-xl mb-6 backdrop-blur-sm">
              <p>{error}</p>
            </div>
          )}

          {qcData && qcData.length > 0 && (
            <div className="mt-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-64 shrink-0">
                  <h3 className="text-lg font-semibold mb-4 text-white">Dostępne partie zdjęć</h3>
                  <div className="space-y-2">
                    {qcData.map((group, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setActiveGroup(index)
                          setActivePhoto(group.photos[0])
                        }}
                        className={cn(
                          "w-full text-left p-3 rounded-lg flex items-center border transition-colors",
                          activeGroup === index
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-100"
                            : "bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700/50 text-white/80 hover:text-white"
                        )}
                      >
                        <Calendar className={cn(
                          "h-4 w-4 mr-2",
                          activeGroup === index ? "text-rose-400" : "text-white/60"
                        )} />
                        <div>
                          <p className="text-sm font-medium">{group.variant}</p>
                          <p className="text-xs opacity-70">{group.photos.length} zdjęć</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  {activeGroup !== null && activePhoto && (
                    <>
                      <div className="relative aspect-square bg-zinc-900/70 rounded-lg overflow-hidden mb-4 border border-zinc-800/50">
                        <Image
                          src={activePhoto || "/placeholder.svg"}
                          alt="QC Photo"
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <a
                          href={activePhoto}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm p-2 rounded-lg hover:bg-black/70 transition-colors border border-zinc-700/50"
                          title="Otwórz w nowym oknie"
                        >
                          <ExternalLink className="h-4 w-4 text-white" />
                        </a>
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                        {qcData[activeGroup].photos.map((photo, index) => (
                          <button
                            key={index}
                            onClick={() => setActivePhoto(photo)}
                            className={cn(
                              "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                              activePhoto === photo 
                                ? "border-rose-500 shadow-lg shadow-rose-500/20" 
                                : "border-zinc-800/50 hover:border-zinc-700/50"
                            )}
                          >
                            <Image
                              src={photo || "/placeholder.svg"}
                              alt={`Thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 25vw, 10vw"
                            />
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {activeGroup === null && (
                    <div className="flex flex-col items-center justify-center h-64 bg-zinc-800/30 backdrop-blur-sm rounded-lg border border-zinc-800/50">
                      <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
                        <ImageIcon className="h-8 w-8 text-rose-400" />
                      </div>
                      <p className="text-white/70">Wybierz grupę zdjęć z listy po lewej stronie</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Jak to działa?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Wklej link",
                description: "Wklej link do produktu z Taobao, Weidian, 1688 lub Tmall w pole wyszukiwania."
              },
              {
                title: "Przeglądaj zdjęcia",
                description: "System automatycznie wyszuka dostępne zdjęcia QC i wyświetli je pogrupowane według daty."
              },
              {
                title: "Oceń jakość",
                description: "Zdjęcia QC są wykonywane przez agentów zakupowych przed wysyłką, co pozwala ocenić jakość produktu."
              }
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
