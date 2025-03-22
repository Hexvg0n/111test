// app/qc/page.js
"use client"

import { useState } from "react"
import { Search, Loader2, ExternalLink, Calendar, ImageIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function QCPage() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [qcData, setQcData] = useState(null)
  const [activeGroup, setActiveGroup] = useState(null)
  const [activePhoto, setActivePhoto] = useState(null)

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
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.NEXT_PUBLIC_API_SECRET || "",
        },
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
    <div className="container mx-auto pt-24 pb-16 px-4 md:px-6">
      <h1 className="text-3xl md:text-4xl font-semibold text-center mb-8 glow-text text-white">
        Zdjęcia QC (Quality Control)
      </h1>
      <p className="text-center mb-10 max-w-3xl mx-auto text-white">
        Wprowadź link do produktu, aby zobaczyć zdjęcia QC. Obsługiwane są linki z Taobao, Weidian, 1688 i Tmall.
      </p>

      <div className="max-w-3xl mx-auto bg-white/5 rounded-xl p-6 mb-10">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            type="text"
            placeholder="Wklej link do produktu..."
            className="flex-1 bg-white/5 border-white/10 focus:border-white/30 text-white"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-white text-black hover:bg-white/90 min-w-[120px]"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
            {isLoading ? "Szukam..." : "Szukaj"}
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-md mb-6">
            <p>{error}</p>
          </div>
        )}

        {qcData && qcData.length > 0 && (
          <div className="mt-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-64 shrink-0">
                <h3 className="text-lg font-medium mb-4 text-white">Dostępne partie zdjęć</h3>
                <div className="space-y-2">
                  {qcData.map((group, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveGroup(index)
                        setActivePhoto(group.photos[0])
                      }}
                      className={`w-full text-left p-3 rounded-md flex items-center ${
                        activeGroup === index
                          ? "bg-white/20 border-white/30"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      } border transition-colors`}
                    >
                      <Calendar className="h-4 w-4 mr-2 opacity-70" />
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
                    <div className="relative aspect-square bg-black/50 rounded-lg overflow-hidden mb-4">
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
                        className="absolute top-2 right-2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
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
                          className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                            activePhoto === photo ? "border-white" : "border-transparent"
                          }`}
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
                  <div className="flex flex-col items-center justify-center h-64 bg-black/20 rounded-lg">
                    <ImageIcon className="h-12 w-12 text-white/30 mb-4" />
                    <p className="text-white/50">Wybierz grupę zdjęć z listy po lewej stronie</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-white">Jak to działa?</h2>
        <div className="space-y-4">
          <p className="text-white">
            Narzędzie QC pozwala na przeglądanie zdjęć kontroli jakości (Quality Control) dla produktów z chińskich
            platform zakupowych.
          </p>
          <p className="text-white">
            Wystarczy wkleić link do produktu z Taobao, Weidian, 1688 lub Tmall, a system automatycznie wyszuka dostępne
            zdjęcia QC i wyświetli je pogrupowane według daty.
          </p>
          <p className="text-white">
            Zdjęcia QC są wykonywane przez agentów zakupowych przed wysyłką produktu, co pozwala na ocenę jakości i
            zgodności z opisem przed otrzymaniem zamówienia.
          </p>
        </div>
      </div>
    </div>
  )
}