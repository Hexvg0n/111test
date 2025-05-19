"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, ArrowLeft, Package, TruckIcon, CheckCircle, AlertCircle, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function TrackingStatus({ status }) {
  const statusMap = {
    delivered: {
      icon: CheckCircle,
      color: "text-green-400 bg-green-500/10 border-green-500/20",
      label: "Doręczono",
    },
    in_transit: {
      icon: TruckIcon,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      label: "W drodze",
    },
    pending: {
      icon: Clock,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      label: "Oczekuje",
    },
    exception: {
      icon: AlertCircle,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      label: "Problem",
    },
  }

  const { icon: Icon, color, label } = statusMap[status] || statusMap.pending

  return (
    <div className={`flex items-center gap-2 ${color} px-4 py-2 rounded-full border`}>
      <Icon className="h-5 w-5 shrink-0" />
      <span className="font-medium">{label}</span>
    </div>
  )
}

function TrackingEvent({ event, isLast }) {
  return (
    <div className="relative pl-8">
      {/* Punkt czasu */}
      <div
        className={cn(
          "absolute left-8 top-0 -translate-x-1/2 w-4 h-4 flex items-center justify-center rounded-full z-10",
          "bg-zinc-900 border-4 border-rose-500/20",
        )}
      >
        <div className="w-2 h-2 bg-rose-500 rounded-full" />
      </div>

      {/* Linia czasu */}
      {!isLast && (
        <div className="absolute left-8 top-4 bottom-0 -translate-x-1/2 w-0.5 bg-gradient-to-b from-rose-500/20 to-zinc-700/20" />
      )}

      {/* Treść zdarzenia */}
      <div className="ml-4 space-y-2 pb-8">
        <p className="text-base font-medium text-white leading-tight">{event.description}</p>
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-sm">
          <span className="text-white/60 flex items-center gap-1">
            <Clock className="h-4 w-4 text-rose-400" />
            {event.date}
          </span>
          <span className="text-white/60 flex items-center gap-1">
            <MapPin className="h-4 w-4 text-rose-400" />
            {event.location}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function TrackingDetails() {
  const { trackingNumber } = useParams()
  const router = useRouter()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/tracking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentCode: decodeURIComponent(trackingNumber) }),
        })

        if (!response.ok) throw new Error("Błąd pobierania danych")

        const result = await response.json()

        if (!result["Informacje główne"] || !result["Szczegóły przesyłki"]) {
          throw new Error("Nieprawidłowy format danych")
        }

        setData(result)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [trackingNumber])

  return (
    <div className="relative bg-[#0A0A0A] min-h-screen text-white selection:bg-rose-500/30 selection:text-white">
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

      {loading ? (
        <div className="min-h-screen flex items-center justify-center p-4 relative z-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-rose-400 animate-spin" />
            </div>
            <p className="text-lg text-white/70">Ładowanie danych przesyłki...</p>
          </div>
        </div>
      ) : error || !data ? (
        <div className="min-h-screen flex items-center justify-center p-4 relative z-20">
          <div className="max-w-md w-full bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm p-8 rounded-xl space-y-6 text-center border border-zinc-800/50 shadow-xl shadow-rose-500/5">
            <div className="space-y-4">
              <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto">
                <AlertCircle className="h-10 w-10 text-rose-400" />
              </div>
              <h2 className="text-2xl font-bold text-rose-400">Błąd</h2>
              <p className="text-white/90">{error || "Nie udało się załadować danych"}</p>
            </div>
            <Button
              onClick={() => router.push("/tracking")}
              className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white px-6 py-6 rounded-xl font-medium transition-all shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30"
            >
              Spróbuj ponownie
            </Button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen p-4 sm:p-8 relative z-20">
          <div className="max-w-6xl mx-auto space-y-8">
            <Button onClick={() => router.back()} variant="ghost" className="text-white/70 hover:text-white group px-0">
              <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              <span className="text-lg">Wróć do listy przesyłek</span>
            </Button>

            <div className="bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 space-y-8 border border-zinc-800/50 shadow-xl shadow-rose-500/5">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
                    <Package className="h-8 w-8 text-rose-400" />
                  </div>
                  <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                      {data["Informacje główne"]?.["Numer śledzenia"] || "Nieznany numer"}
                    </h1>
                  </div>
                </div>
                <TrackingStatus status={data["Informacje główne"]?.["Ostatni status"]?.toLowerCase() || "pending"} />
              </div>

              {/* Info Grid */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Route Card */}
                <div className="bg-zinc-800/30 backdrop-blur-sm p-6 rounded-xl border border-zinc-700/30">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="h-6 w-6 text-rose-400" />
                    <h3 className="text-xl font-semibold text-white">Trasa przesyłki</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-sm uppercase tracking-wider text-white/70">Kraj docelowy</p>
                      <p className="text-lg text-white">{data["Informacje główne"]?.Kraj || "Brak danych"}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm uppercase tracking-wider text-white/70">Odbiorca</p>
                      <p className="text-lg text-white">{data["Informacje główne"]?.["Odbiorca"] || "Brak danych"}</p>
                    </div>
                  </div>
                </div>

                {/* Status Card */}
                <div className="bg-zinc-800/30 backdrop-blur-sm p-6 rounded-xl border border-zinc-700/30">
                  <h3 className="text-xl font-semibold text-white mb-6">Aktualny status</h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Ostatnia aktualizacja:</span>
                      <span className="text-white text-lg">{data["Informacje główne"]?.Data || "Nieznana"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Lokalizacja:</span>
                      <span className="text-white text-lg text-right">
                        {data["Szczegóły przesyłki"]?.[0]?.Lokalizacja || "Nieznana"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* History Section */}
              <div className="bg-zinc-800/30 backdrop-blur-sm p-6 rounded-xl border border-zinc-700/30">
                <h3 className="text-xl font-semibold text-white mb-8">Historia przesyłki</h3>
                <div className="relative">
                  {/* Lista zdarzeń */}
                  <div className="space-y-8">
                    {data["Szczegóły przesyłki"]?.map((event, index, array) => (
                      <TrackingEvent
                        key={index}
                        event={{
                          description: event?.Status || "Brak opisu",
                          date: event?.Data || "Nieznana data",
                          location: event?.Lokalizacja || "Nieznana lokalizacja",
                        }}
                        isLast={index === array.length - 1}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

