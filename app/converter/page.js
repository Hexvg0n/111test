"use client"
import { useState } from "react"
// ZMIANA 1: Import komponentu Image z Next.js
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, ExternalLink, ArrowRight, LinkIcon, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import Navbar from "@/components/navbar"

// ZMIANA 2: Zaktualizowana konfiguracja z `icon` zamiast `color`
// Pamiętaj, aby umieścić pliki ikon w folderze /public/icons/
const middlemenConfig = {
  kakobuy: { name: "Kakobuy", icon: "/images/icons/kakobuy.jpg", fallbackColor: "rose" },
  superbuy: { name: "Superbuy", icon: "/images/icons/superbuy.png", fallbackColor: "blue" },
  cssbuy: { name: "CSSBuy", icon: "/images/icons/cssbuy.png", fallbackColor: "green" },
  allchinabuy: { name: "AllChinaBuy", icon: "/images/icons/allchina.jpg", fallbackColor: "green" },
  basetao: { name: "Basetao", icon: "/images/icons/basetao.ico", fallbackColor: "red" },
  lovegobuy: { name: "LoveGoBuy", icon: "/images/icons/lovego.png", fallbackColor: "green" },
  cnfans: { name: "CNFans", icon: "/images/icons/cnfans.png", fallbackColor: "rose" },
  joyabuy: { name: "Joyabuy", icon: "/images/icons/joyagoo.png", fallbackColor: "rose" },
  mulebuy: { name: "Mulebuy", icon: "/images/icons/mulebuy.png", fallbackColor: "rose" },
  hoobuy: { name: "HooBuy", icon: "/images/icons/hoobuy.png", fallbackColor: "violet" },
  acbuy: {name: "ACBuy", icon: "/images/icons/acbuylogo.png", fallbackColor:"green"}
}


export default function ConverterPage() {
  const [inputUrl, setInputUrl] = useState("")
  const [convertedUrls, setConvertedUrls] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [notification, setNotification] = useState(null)
  const [copiedKey, setCopiedKey] = useState(null)

  const showNotification = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleConvert = async () => {
    if (!inputUrl.trim()) {
      showNotification("error", "Proszę wkleić link")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/converter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl }),
      })

      if (!response.ok) throw new Error("Błąd konwersji")

      const data = await response.json()
      setConvertedUrls(data)
    } catch (error) {
      showNotification("error", error.message || "Nieznany błąd")
    } finally {
      setLoading(false)
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

      {notification && (
        <div
          className={cn(
            "fixed top-4 right-4 p-4 rounded-xl shadow-lg z-50 backdrop-blur-sm border transition-all duration-300",
            notification.type === "error"
              ? "bg-red-900/70 border-red-500/50 text-white"
              : "bg-green-900/70 border-green-500/50 text-white",
          )}
        >
          {notification.message}
        </div>
      )}
      <div className="container mx-auto pt-24 pb-16 px-4 md:px-6 relative z-20">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-rose-400 drop-shadow-[0_0_25px_rgba(244,63,94,0.2)]">
            Konwerter Linków
          </span>
        </h1>

        <div className="max-w-3xl mx-auto bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-xl p-8 mb-10 border border-zinc-800/50 shadow-xl shadow-rose-500/5">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-rose-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Wklej link tutaj..."
                className="flex-1 pl-12 py-6 bg-zinc-800/50 border-zinc-700/50 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 rounded-xl text-white transition-all"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConvert()}
              />
            </div>
            <Button
              onClick={handleConvert}
              disabled={loading}
              className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white px-6 py-6 rounded-xl font-medium transition-all shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 min-w-[140px]"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Konwertuję...
                </span>
              ) : (
                <>
                  Konwertuj
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>

          {convertedUrls && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
              <TabsList className="grid grid-cols-2 mb-6 bg-zinc-800/50 p-1 rounded-lg">
                <TabsTrigger
                  value="all"
                  className={cn(
                    "rounded-md transition-all",
                    activeTab === "all" ? "bg-rose-500 text-white" : "text-white/70 hover:text-white",
                  )}
                >
                  Wszystkie linki
                </TabsTrigger>
                <TabsTrigger
                  value="original"
                  className={cn(
                    "rounded-md transition-all",
                    activeTab === "original" ? "bg-rose-500 text-white" : "text-white/70 hover:text-white",
                  )}
                >
                  Oryginalny link
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {Object.entries(convertedUrls).map(([key, url]) => {
                  if (key === "original") return null
                  
                  // ZMIANA 3: Pobieranie pełnych danych o agencie
                  const middlemanInfo = middlemenConfig[key]
                  const middlemanName = middlemanInfo?.name || key
                  const middlemanIcon = middlemanInfo?.icon
                  const fallbackColor = middlemanInfo?.fallbackColor || "rose"

                  return (
                    <div
                      key={key}
                      className="bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-lg p-4 border border-zinc-800/50 hover:border-zinc-700/50 transition-all"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-white flex items-center">
                          {/* ZMIANA 4: Logika wyświetlania ikony lub kropki */}
                          {middlemanIcon ? (
                            <Image
                              src={middlemanIcon}
                              alt={`${middlemanName} logo`}
                              width={20}
                              height={20}
                              className="mr-2 rounded-sm" // Możesz zmienić na rounded-full jeśli wolisz okrągłe ikony
                            />
                          ) : (
                            <span className={`inline-block w-2.5 h-2.5 rounded-full bg-${fallbackColor}-500 mr-2`}></span>
                          )}
                          {middlemanName}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCopy(url, key)}
                            className="text-white/70 hover:text-white bg-zinc-800/70 hover:bg-zinc-700/70 p-2 rounded-lg transition-colors"
                            title="Kopiuj link"
                          >
                            {copiedKey === key ? (
                              <Check className="h-4 w-4 text-green-400" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/70 hover:text-white bg-zinc-800/70 hover:bg-zinc-700/70 p-2 rounded-lg transition-colors"
                            title="Otwórz link"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                      <p className="text-white/70 text-sm truncate">{url}</p>
                    </div>
                  )
                })}
              </TabsContent>

              <TabsContent value="original">
                {convertedUrls.original && (
                  <div className="bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-lg p-4 border border-zinc-800/50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-white flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-white mr-2"></span>
                        Oryginalny link
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopy(convertedUrls.original, "original")}
                          className="text-white/70 hover:text-white bg-zinc-800/70 hover:bg-zinc-700/70 p-2 rounded-lg transition-colors"
                          title="Kopiuj link"
                        >
                          {copiedKey === "original" ? (
                            <Check className="h-4 w-4 text-green-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                        <a
                          href={convertedUrls.original}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/70 hover:text-white bg-zinc-800/70 hover:bg-zinc-700/70 p-2 rounded-lg transition-colors"
                          title="Otwórz link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm break-all">{convertedUrls.original}</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* Informational section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            Jak działa konwerter?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Wklej link",
                description: "Wklej link do produktu z chińskiej platformy zakupowej (Taobao, Weidian, 1688, Tmall).",
              },
              {
                title: "Konwertuj",
                description:
                  "Nasz system automatycznie przekształci link na formaty kompatybilne z różnymi agentami zakupowymi.",
              },
              {
                title: "Używaj",
                description:
                  "Skopiuj przekonwertowany link i użyj go bezpośrednio na stronie wybranego agenta zakupowego.",
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

