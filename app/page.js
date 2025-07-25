"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, ChevronDown, ExternalLink, ShoppingBag, Sparkles, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import Navbar from "@/components/navbar"
import { motion, AnimatePresence } from "framer-motion"

// Enhanced product data with image placeholders
const products = [
  {
    id: 1,
    name: "Termoaktywna maska Supreme",
    price: "40 zł",
    image: "images/maska.png",
    rating: 4.8,
    reviews: 791,
    link: "https://acbuy.com/product?id=883481045520&u=dripez&source=TB",
  },
  {
    id: 2,
    name: "Balenciaga Track",
    price: "220 zł",
    image: "images/trackinew.png",
    rating: 4.9,
    reviews: 2256,
    link: "https://acbuy.com/product?id=7311979753&u=dripez&source=WD",
  },
  {
    id: 3,
    name: "Air Force 1 (Wiele kolorystyk)",
    price: "80 zł",
    image: "images/forcy.png",
    rating: 4.7,
    reviews: 9289,
    link: "https://acbuy.com/product?id=7312892706&u=dripez&source=WD",
  },
  {
    id: 4,
    name: "YZY Slide",
    price: "60 zł",
    image: "images/slidesystrona.png",
    rating: 4.6,
    reviews: 167,
    link: "https://acbuy.com/product?id=4480454092&u=dripez&source=WD",
  },
  {
    id: 5,
    name: "【定制 AIR MAG BACK TO THE FUTURE",
    price: "1200 zł",
    image: "images/airmagi.png",
    rating: 4.9,
    reviews: 312,
    link: "https://acbuy.com/product?id=7313684700&u=dripez&source=WD",
  },
  {
    id: 6,
    name: "SUDU AirPods Pro 2 ",
    price: "280 zł",
    image: "images/podsywebsite.png",
    rating: 4.0,
    reviews: 98,
    link: "https://acbuy.com/product?id=6953834871&u=dripez&source=WD",
  },
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
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5 }}
    >
      <Link
        href={`${product.link}`}
        className={cn(
          "group w-full bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-xl overflow-hidden border border-zinc-800/50",
          "transition-all duration-300 ease-out",
          isHovered && "translate-y-[-8px] shadow-lg shadow-rose-500/10",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <motion.div
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-transform duration-500",
              isHovered && "scale-110",
            )}
            style={{ backgroundImage: `url(${product.image})` }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-rose-400 px-3 py-1 rounded-full text-sm font-medium border border-rose-500/20">
            {product.rating} <Star className="inline-block h-3 w-3" />
          </div>
          <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button className="w-full py-2 bg-rose-600 hover:bg-rose-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
              <ShoppingBag className="h-4 w-4" />
              Zobacz produkt
            </button>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-medium text-white group-hover:text-rose-400 transition-colors">{product.name}</h3>
          <div className="flex items-center justify-between mt-2">
            <p className="text-rose-500 font-semibold text-lg">{product.price}</p>
            <p className="text-white/60 text-sm">{product.reviews} opinii</p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function FaqItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border-b border-zinc-800/50"
    >
      <button
        className="flex justify-between items-center w-full text-left text-lg font-medium py-5 text-white/90 hover:text-rose-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {faq.question}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="h-5 w-5 text-rose-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-white/70 pb-5">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Home() {
  const [activeSection, setActiveSection] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="relative bg-[#0A0A0A] min-h-screen text-white selection:bg-rose-500/30 selection:text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top gradient - bardziej miękkie przejścia */}
        <motion.div
          className="absolute top-0 left-0 w-full h-[70vh] bg-gradient-to-br from-rose-500/10 from-10% via-purple-500/[15%] via-40% to-transparent to-90%"
          style={{
            transform: "translate3d(0, 0, 0)",
            backfaceVisibility: "hidden",
            filter: "blur(20px)",
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Bottom gradient - rozmyte krawędzie */}
        <motion.div
          className="absolute bottom-0 right-0 w-full h-[50vh] bg-gradient-to-tl from-purple-500/10 from-10% via-indigo-500/[15%] via-40% to-transparent to-40%"
          style={{
            transform: "translate3d(0, 0, 0)",
            backfaceVisibility: "hidden",
            filter: "blur(20px)",
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2.5,
          }}
        />

        {/* Animated particles */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-rose-500/5 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-3/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 4,
            }}
          />
        </div>
      </div>

      {/* Noise texture overlay */}
      <div className="fixed inset-0 bg-[url('/placeholder.svg?height=200&width=200')] opacity-[0.03] pointer-events-none z-10" />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        className="relative pt-32 pb-20 px-4 md:px-6 lg:px-8 container mx-auto z-20"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-3 px-3 py-1 bg-gradient-to-r from-rose-500/20 to-rose-500/10 backdrop-blur-sm rounded-full text-sm font-medium text-rose-400 border border-rose-500/20"
          >
            <Sparkles className="inline-block h-4 w-4 mr-2" />
            Najlepsze repliki w jednym miejscu
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              WSZYSTKIE TWOJE POTRZEBY
            </span>
            <br />
            <span className="text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-rose-400 drop-shadow-[0_0_25px_rgba(244,63,94,0.2)]">
              REPIARSKIE
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-lg md:text-xl text-white/70 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Wszystko, czego potrzebujesz – w jednym miejscu. Znajdziesz tu itemy, dowiesz się, jak składać zamówienia,
            wygodnie przekonwertujesz linki, sprawdzisz status swojej paczki oraz przejrzysz zdjęcia QC
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="https://www.acbuy.com/login?loginStatus=register&code=dripez"
              className="group bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 px-6 py-3.5 rounded-xl text-white font-medium transition-all shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40"
            >
              <span className="flex items-center justify-center">
                Dostań 150$ za rejestrację na ACBuy
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
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="py-24 px-4 md:px-6 lg:px-8 container mx-auto relative z-20"
      >
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
              link: "https://discord.com/invite/Bx8ddZTD28",
              gradient: "from-indigo-500/20 to-purple-500/20",
              borderColor: "border-indigo-500/20",
            },
            {
              title: "Rejestracja",
              icon: ExternalLink,
              desc: "Zarejestruj się i odbierz 150$",
              link: "https://www.acbuy.com/login?loginStatus=register&code=dripez",
              gradient: "from-purple-500/20 to-rose-500/20",
              borderColor: "border-purple-500/20",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 1.4 + index * 0.2 }}
            >
              <Link
                href={item.link}
                className={cn(
                  "group bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-xl p-8 flex flex-col items-center text-center",
                  "border border-zinc-800/50 hover:border-zinc-700/50",
                  "transition-all duration-300 hover:translate-y-[-8px]",
                  "relative overflow-hidden",
                )}
              >
                <motion.div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    "bg-gradient-to-br",
                    item.gradient,
                  )}
                  style={{ filter: "blur(30px)" }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />

                <motion.div
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative",
                    "bg-gradient-to-br",
                    item.gradient,
                    "border",
                    item.borderColor,
                  )}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {React.createElement(item.icon, { className: "h-6 w-6 text-white" })}
                </motion.div>

                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-white/90 relative">
                  {item.title}
                </h3>
                <p className="text-white/60 group-hover:text-white/70 transition-colors relative">{item.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            WYRÓŻNIONE PRZEDMIOTY
          </span>
        </motion.h2>
        {/* Products Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 2 }}
          className="w-full overflow-hidden mb-16"
        >
          <div className="relative carousel-container overflow-hidden">
            <div className="flex gap-6 carousel-track">
              {[...products, ...products].map((product, index) => (
                <div key={`${product.id}-${index}`} className="w-96 flex-shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 2.2 }}
        className="py-24 px-4 md:px-6 lg:px-8 container mx-auto z-20"
      >
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 2.4 }}
            className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Najczęściej zadawane pytania
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 2.6 }}
            className="bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800/50"
          >
            {faqs.map((faq, index) => (
              <FaqItem key={index} faq={faq} index={index} />
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 2.8 }}
        className="py-12 px-4 md:px-6 lg:px-8 border-t border-zinc-800/50 bg-black/30 backdrop-blur-sm relative z-20"
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-rose-400">
                DRIPEZ
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
              <Link
                href="https://discord.com/invite/Bx8ddZTD28"
                className="text-white/70 hover:text-rose-400 transition-colors"
              >
                Discord
              </Link>
              <Link href="/sociale" className="text-white/70 hover:text-rose-400 transition-colors">
                Sociale
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-800/50 text-center text-white/50 text-sm">
            © {new Date().getFullYear()} REPIARSKIE. Wszelkie prawa zastrzeżone.
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-800/50 text-center text-white/50 text-sm">
            Serwis dripez.pl pełni wyłącznie funkcję informacyjną i ostrzegawczą – nie wspieramy ani nie rekomendujemy zakupu nieoryginalnych produktów.
Nie jesteśmy w żaden sposób powiązani z platformami zakupowymi takimi jak Weidian.com, Taobao.com, 1688.com, Tmall.com ani innymi serwisami handlowymi. Nasza strona nie stanowi oficjalnej oferty ani przedstawicielstwa tych platform.
Wszystkie linki prowadzące do ofert zewnętrznych (w tym przyciski z cenami, odnośniki oznaczone gwiazdką oraz linki osadzone w obrazach) mają charakter afiliacyjny. Nie otrzymujemy prowizji od wartości poszczególnych produktów, a jedynie wynagrodzenie za pośrednictwo jako spedytor.
dripez.pl nie jest sklepem internetowym i nie sprzedaje żadnych towarów własnych. Naszą misją jest ułatwienie wyszukiwania i porównywania ofert dostępnych na platformie kakobuy oraz innych serwisach, wyłącznie w celach informacyjnych.
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
