"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Youtube, MessageSquare, Instagram, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

// Custom TikTok icon since Lucide doesn't have one
const TikTokIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
)

export default function LinksPage() {
  const [activeLink, setActiveLink] = useState(null)

  const socialLinks = [
    {
      name: "KakoBuy",
      description: "Zarejestruj się i odbierz 150$ na zakupy",
      url: "https://www.kakobuy.com/register?affcode=dripez",
      icon: ShoppingBag,
      color: "from-orange-500 to-red-500",
      hoverColor: "group-hover:from-orange-400 group-hover:to-red-400",
    },
    {
      name: "TikTok",
      description: "Obserwuj mnie na TikToku",
      url: "https://www.tiktok.com/@dripezpl",
      icon: TikTokIcon,
      color: "from-pink-500 to-purple-500",
      hoverColor: "group-hover:from-pink-400 group-hover:to-purple-400",
    },
    {
      name: "YouTube",
      description: "Sprawdź mój kanał na YouTube",
      url: "https://youtube.com/@dripezpl",
      icon: Youtube,
      color: "from-red-500 to-red-600",
      hoverColor: "group-hover:from-red-400 group-hover:to-red-500",
    },
    {
      name: "Discord",
      description: "Dołącz do naszej społeczności na Discord",
      url: "https://discord.com/invite/Bx8ddZTD28",
      icon: () => (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      ),
      color: "from-indigo-500 to-blue-500",
      hoverColor: "group-hover:from-indigo-400 group-hover:to-blue-400",
    },
    {
      name: "Instagram",
      description: "Obserwuj mnie na Instagramie",
      url: "https://www.instagram.com/dripezpl",
      icon: Instagram,
      color: "from-purple-500 to-pink-500",
      hoverColor: "group-hover:from-purple-400 group-hover:to-pink-400",
    },
  ]

  const handleLinkClick = (index) => {
    setActiveLink(index)
    setTimeout(() => setActiveLink(null), 2000)
  }

  return (
    <div className="relative bg-[#0A0A0A] min-h-screen text-white selection:bg-rose-500/30 selection:text-white">
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

      <div className="container mx-auto pt-16 pb-16 px-4 md:px-6 relative z-20">
        <div className="max-w-3xl mx-auto">
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-12">
            <div className="relative w-28 h-28 rounded-full overflow-hidden mb-6 border-4 border-rose-500/30 shadow-lg shadow-rose-500/20">
              <Image src="https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-euttp/161bfd7e2c0ccf91ec0213b0bd2fb963~tplv-tiktokx-cropcenter:1080:1080.jpeg?dr=10399&refresh_token=9c074b93&x-expires=1744804800&x-signature=NPh5NamGt5EGguGcnXdmS3reRfw%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=no1a" alt="Profile" fill className="object-cover" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-rose-400 drop-shadow-[0_0_25px_rgba(244,63,94,0.2)]">
                @dripezpl
              </span>
            </h1>
            <p className="text-white/70 text-center max-w-md mb-2">
              Wszystko, czego potrzebujesz – w jednym miejscu. Znajdziesz tu itemy, dowiesz się, jak składać zamówienia,
              wygodnie przekonwertujesz linki, sprawdzisz status swojej paczki oraz przejrzysz zdjęcia QC.
            </p>
            <div className="flex gap-2 mt-2">
              <Link
                href="/"
                className="text-white/70 hover:text-white text-sm px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                Strona główna
              </Link>
              <Link
                href="/how-to"
                className="text-white/70 hover:text-white text-sm px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                Jak zamawiać
              </Link>
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(index)}
                className={cn(
                  "group block w-full p-4 rounded-xl transition-all duration-300 relative overflow-hidden",
                  "bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm",
                  "border border-zinc-800/50 hover:border-zinc-700/50",
                  "hover:shadow-lg hover:shadow-rose-500/10 hover:translate-y-[-4px]",
                )}
              >
                {/* Background gradient that appears on hover */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500",
                    "bg-gradient-to-r",
                    link.color,
                  )}
                />

                <div className="flex items-center gap-4 relative z-10">
                  <div
                    className={cn(
                      "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                      "bg-gradient-to-r transition-all duration-300",
                      link.color,
                      link.hoverColor,
                    )}
                  >
                    {link.icon && <link.icon className="h-5 w-5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-rose-300 transition-colors">
                      {link.name}
                    </h3>
                    <p className="text-white/60 text-sm">{link.description}</p>
                  </div>
                  <div
                    className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                      "bg-white/5 group-hover:bg-white/10 transition-all",
                      activeLink === index && "bg-green-500/20 text-green-400",
                    )}
                  >
                    {activeLink === index ? (
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
                    ) : (
                      <ExternalLink className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <p className="text-white/50 text-sm">© {new Date().getFullYear()} dripezpl. Wszelkie prawa zastrzeżone.</p>
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
