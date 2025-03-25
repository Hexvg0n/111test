"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"

const styles = {
  glowText: {
    textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
  },
  productCard: {
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  productCardHover: {
    transform: "translateY(-10px) scale(1.05)",
    boxShadow: "0 10px 25px rgba(255, 255, 255, 0.1)",
  },
}

const products = [
  { id: 1, name: "Nike Air Force 1", price: "350 zł" },
  { id: 2, name: "Adidas Yeezy Boost", price: "450 zł" },
  { id: 3, name: "Jordan 4 Retro", price: "550 zł" },
  { id: 4, name: "New Balance 550", price: "380 zł" },
  { id: 5, name: "Puma RS-X", price: "320 zł" },
  { id: 6, name: "Converse Chuck Taylor", price: "280 zł" },
]

function ProductCard({ product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="flex-none w-64 bg-white/5 rounded-xl overflow-hidden"
      style={styles.productCard}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, styles.productCardHover)
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = ""
        e.currentTarget.style.boxShadow = ""
      }}
    >
      <div className="relative h-64 w-full bg-gray-800"></div>
      <div className="p-4">
        <h3 className="text-lg font-medium">{product.name}</h3>
        <p className="text-white/70">{product.price}</p>
      </div>
    </Link>
  )
}

function FaqSection() {
  const faqs = [
    {
      question: "Co znajdę na tej stronie?",
      answer: "Znajdziesz tu itemy, dowiesz się, jak składać zamówienia, wygodnie przekonwertujesz linki, sprawdzisz status swojej paczki oraz przejrzysz zdjęcia QC",
    },
    {
      question: "Jak zamawiać?",
      answer: "Wszystkie porady dotyczące składania zamówień znajdziesz w zakładce How To. Tam znajdziesz szczegółowy przewodnik krok po kroku, który pomoże Ci bez problemu zrealizować zamówienie.",
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

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 container mx-auto">
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12" style={styles.glowText}>
        Najczęściej zadawane pytania (FAQ)
      </h2>

      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-white/10 py-4">
            <button
              className="flex justify-between items-center w-full text-left text-lg font-medium py-2"
              onClick={(e) => {
                const content = e.currentTarget.nextElementSibling
                if (content) {
                  content.classList.toggle("hidden")
                }
              }}
            >
              {faq.question}
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="hidden text-white/80 pt-2 pb-4">{faq.answer}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="relative bg-black min-h-screen">
      <div className="absolute  bg-gradient-to-br from-slate-900/30 to-black pointer-events-none"></div>

      <section className="pt-32 pb-20 px-4 md:px-6 lg:px-8 container mx-auto relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-6" style={styles.glowText}>
            WSZYSTKIE TWOJE POTRZEBY
            <br />
            <span className="text-5xl md:text-6xl lg:text-7xl">REPIARSKIE</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto">
            Wszystko, czego potrzebujesz – w jednym miejscu. Znajdziesz tu itemy, dowiesz się, jak składać zamówienia,
            wygodnie przekonwertujesz linki, sprawdzisz status swojej paczki oraz przejrzysz zdjęcia QC
          </p>
          <Link
            href="https://cnfans.com/register"
            className="from-rose-500 via-red-500 to-red-700 bg-gradient-to-br inline-flex items-center bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-lg text-white transition-all group"
          >
            <span>Dostań 150$ za rejestrację na CNfans</span>
            <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 md:px-6 lg:px-8 container mx-auto relative">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12" style={styles.glowText}>
          WYRÓŻNIONE PRZEDMIOTY
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { title: "Produkty", icon: ArrowRight, desc: "Przeglądaj nasze produkty", link: "/products" },
            {
              title: "Discord",
              icon: () => (
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              ),
              desc: "Dołącz do naszej społeczności",
              link: "/discord",
            },
            {
              title: "Rejestracja",
              icon: ExternalLink,
              desc: "Zarejestruj się i odbierz 150$",
              link: "https://cnfans.com/register",
            },
          ].map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="bg-white/5 rounded-xl p-6 flex flex-col items-center text-center"
              style={styles.productCard}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, styles.productCardHover)
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = ""
                e.currentTarget.style.boxShadow = ""
              }}
            >
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                {React.createElement(item.icon, { className: "h-8 w-8" })}
              </div>
              <h3 className="text-xl font-medium mb-2">{item.title}</h3>
              <p className="text-white/70">{item.desc}</p>
            </Link>
          ))}
        </div>

        <div className="w-full overflow-hidden">
          <div className="flex gap-6" style={{ animation: "slideLeft 60s linear infinite" }}>
            {[...products, ...products].map((product, index) => (
              <ProductCard key={`${product.id}-${index}`} product={product} />
            ))}
          </div>
        </div>
      </section>

      <FaqSection />
    </div>
  )
}