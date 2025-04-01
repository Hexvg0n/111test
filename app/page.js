"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ArrowRight, ChevronDown, ExternalLink, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import Navbar from "@/components/navbar"

// Enhanced product data with image placeholders
const products = [
  { id: 1, name: "Nike Air Force 1", price: "350 zł", image: "https://static.nike.com/a/images/w_1280,q_auto,f_auto/7c3bfec4-dce3-4828-82da-377663e099db/air-force-1-07-%E2%80%9Efresh%E2%80%9D-dm0211-100-%E2%80%93-data-premiery.jpg" },
  { id: 2, name: "Adidas Yeezy Boost 3-50", price: "450 zł", image: "https://securedstuff.pl/cdn/shop/products/adidas-yeezy-boost-350-v2-natural-925373.webp?v=1701178656" },
  { id: 3, name: "Jordan 4 Retro Metalic Red", price: "550 zł", image: "https://static.nike.com/a/images/w_1280,q_auto,f_auto/cbbd92db-b786-42ba-a2b6-c3815169f818/air-jordan-4-red-metallic-release-date.jpg" },
  { id: 4, name: "New Balance 550", price: "380 zł", image: "https://drop-up.pl/cdn/shop/files/550-white-grey-drop-up.webp?v=1717279027&width=1445" },
  { id: 5, name: "Air Jordan 1 Low „Travis Scott x Fragment”", price: "320 zł", image: "https://static.nike.com/a/images/w_1280,q_auto,f_auto/15b77901-eb6e-46a8-8c2e-76beb0b5b42a/air-jordan-1-low-%E2%80%9Etravis-scott-x-fragment%E2%80%9D-%E2%80%93-data-premiery.jpg" },
  { id: 6, name: "Converse Chuck Taylor", price: "280 zł", image: "/https://securedstuff.pl/cdn/shop/files/snakerstoreNike_Shox_TL_White_Metallic_Silver_Max_Orange-AR3566-100-0_png.webp?v=1711027906" },
]

// FAQ data
const faqs = [
  {
    question: "Co znajdę na tej stronie?",
    answer:
      "Znajdziesz tu itemy, dowiesz się, jak składać zamówienia, wygodnie przekonwertujesz linki, sprawdzisz status swojej paczki oraz przejrzysz zdjęcia QC",
  },
  {
    question: "Jak zamawiać?",
    answer:
      "Wszystkie porady dotyczące składania zamówień znajdziesz w zakładce How To. Tam znajdziesz szczegółowy przewodnik krok po kroku, który pomoże Ci bez problemu zrealizować zamówienie.",
  },
  {
    question: "Po co mi ta strona?",
    answer: "Ułatwia życie :)",
  },
  {
    question: "Czy mogę kupić repy bez agenta?",
    answer: "W celu zrobienia proxy musicie utworzyć ticketa na discordzie.",
  },
]

function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn(
        "group flex-none w-72 bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-xl overflow-hidden border border-zinc-800/50",
        "transition-all duration-300 ease-out",
        isHovered && "translate-y-[-8px] shadow-lg shadow-rose-500/10",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-72 w-full overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-transform duration-500",
            isHovered && "scale-110",
          )}
          style={{ backgroundImage: `url(${product.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button className="w-full py-2 bg-rose-600 hover:bg-rose-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
            <ShoppingBag className="h-4 w-4" />
            Zobacz produkt
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-white group-hover:text-rose-400 transition-colors">{product.name}</h3>
        <p className="text-rose-500 font-semibold mt-1">{product.price}</p>
      </div>
    </Link>
  )
}

function FaqItem({ faq }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-zinc-800/50">
      <button
        className="flex justify-between items-center w-full text-left text-lg font-medium py-5 text-white/90 hover:text-rose-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {faq.question}
        <ChevronDown
          className={cn("h-5 w-5 text-rose-500 transition-transform duration-300", isOpen && "transform rotate-180")}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <p className="text-white/70">{faq.answer}</p>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
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
  className="absolute bottom-0 right-0 w-full h-[50vh] bg-gradient-to-tl from-purple-500/10 from-10% via-indigo-500/[15%] via-40% to-transparent to-40%"
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

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:px-6 lg:px-8 container mx-auto z-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-3 px-3 py-1 bg-gradient-to-r from-rose-500/20 to-rose-500/10 backdrop-blur-sm rounded-full text-sm font-medium text-rose-400 border border-rose-500/20">
            Najlepsze repliki w jednym miejscu
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              WSZYSTKIE TWOJE POTRZEBY
            </span>
            <br />
            <span className="text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-rose-400 drop-shadow-[0_0_25px_rgba(244,63,94,0.2)]">
              REPIARSKIE
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-3xl mx-auto leading-relaxed">
            Wszystko, czego potrzebujesz – w jednym miejscu. Znajdziesz tu itemy, dowiesz się, jak składać zamówienia,
            wygodnie przekonwertujesz linki, sprawdzisz status swojej paczki oraz przejrzysz zdjęcia QC
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://ikako.vip/r/dripez"
              className="group bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 px-6 py-3.5 rounded-xl text-white font-medium transition-all shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40"
            >
              <span className="flex items-center justify-center">
                Dostań 150$ za rejestrację na KakoBuy
                <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/w2c"
              className="group px-6 py-3.5 rounded-xl text-white/90 font-medium transition-all border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm"
            >
              <span className="flex items-center justify-center">
                Przeglądaj produkty
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 px-4 md:px-6 lg:px-8 container mx-auto relative z-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            WYRÓŻNIONE PRZEDMIOTY
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            {
              title: "Produkty",
              icon: ShoppingBag,
              desc: "Przeglądaj nasze produkty",
              link: "/w2c",
              gradient: "from-blue-500/20 to-indigo-500/20",
              borderColor: "border-blue-500/20",
            },
            {
              title: "Discord",
              icon: () => (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              ),
              desc: "Dołącz do naszej społeczności",
              link: "/discord",
              gradient: "from-indigo-500/20 to-purple-500/20",
              borderColor: "border-indigo-500/20",
            },
            {
              title: "Rejestracja",
              icon: ExternalLink,
              desc: "Zarejestruj się i odbierz 150$",
              link: "https://ikako.vip/r/dripez",
              gradient: "from-purple-500/20 to-rose-500/20",
              borderColor: "border-purple-500/20",
            },
          ].map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className={cn(
                "group bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-xl p-8 flex flex-col items-center text-center",
                "border border-zinc-800/50 hover:border-zinc-700/50",
                "transition-all duration-300 hover:translate-y-[-8px]",
                "relative overflow-hidden",
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  "bg-gradient-to-br",
                  item.gradient,
                )}
                style={{ filter: "blur(30px)" }}
              />

              <div
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative",
                  "bg-gradient-to-br",
                  item.gradient,
                  "border",
                  item.borderColor,
                )}
              >
                {React.createElement(item.icon, { className: "h-6 w-6 text-white" })}
              </div>

              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-white/90 relative">{item.title}</h3>
              <p className="text-white/60 group-hover:text-white/70 transition-colors relative">{item.desc}</p>
            </Link>
          ))}
        </div>

        {/* Products Carousel */}
        <div className="w-full overflow-hidden mb-16">
          <div className="flex gap-6 animate-[slideLeft_60s_linear_infinite] hover:pause">
            {[...products, ...products].map((product, index) => (
              <ProductCard key={`${product.id}-${index}`} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 md:px-6 lg:px-8 container mx-auto z-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Najczęściej zadawane pytania
            </span>
          </h2>

          <div className="bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800/50">
            {faqs.map((faq, index) => (
              <FaqItem key={index} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-6 lg:px-8 border-t border-zinc-800/50 bg-black/30 backdrop-blur-sm relative z-20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-rose-400">
                REPIARSKIE
              </div>
              <p className="text-white/50 mt-2">Wszystko, czego potrzebujesz w jednym miejscu</p>
            </div>
            <div className="flex gap-6">
              <Link href="/w2c" className="text-white/70 hover:text-rose-400 transition-colors">
                Produkty
              </Link>
              <Link href="/how-to" className="text-white/70 hover:text-rose-400 transition-colors">
                Jak zamawiać
              </Link>
              <Link href="/discord" className="text-white/70 hover:text-rose-400 transition-colors">
                Discord
              </Link>
              <Link href="/contact" className="text-white/70 hover:text-rose-400 transition-colors">
                Kontakt
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-800/50 text-center text-white/50 text-sm">
            © {new Date().getFullYear()} REPIARSKIE. Wszelkie prawa zastrzeżone.
          </div>
        </div>
      </footer>
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

