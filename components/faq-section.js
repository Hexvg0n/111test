// components/faq-section.js
"use client"

import { useState } from "react"
import Link from "next/link" // Upewnij się, że Link jest zaimportowany
import { ChevronDown } from "lucide-react"

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-white/20 py-4">
      <button onClick={() => setIsOpen(!isOpen)} className="flex w-full justify-between items-center text-left">
        <h3 className="text-lg font-medium text-white">{question}</h3>
        <ChevronDown className={`h-5 w-5 text-white transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <div className="pt-2 pb-2 text-white">{answer}</div>}
    </div>
  )
}

export default function FaqSection() {
  const faqItems = [
    {
      question: "Co znajdę na tej stronie?",
      answer: "Znajdziesz tu itemy, dowiesz się, jak składać zamówienia, wygodnie przekonwertujesz linki, sprawdzisz status swojej paczki oraz przejrzysz zdjęcia QC",
    },
    {
      question: "Jak zamawiać?",
      answer: (
        <>
          Wszystkie porady dotyczące składania zamówień znajdziesz w zakładce{" "}
          <Link href="/how-to" className="text-white underline hover:text-white/90 text-red-400">
            How To
          </Link>
          . Tam znajdziesz szczegółowy przewodnik krok po kroku, który pomoże Ci bez problemu zrealizować zamówienie.
        </>
      ),
    },
    {
      question: "Czy ACBuy jest bezpieczny?",
      answer: "ACBuy jest bezpieczną platformą, oferującą zaufane metody płatności, takie jak blik,karta itp Jeśli sprzedawca wyśle Ci produkt niezgodny z zamówieniem, otrzymasz zwrot środków!",
    },
    {
      question: "Czy celnik mi zabierze paczke?",
      answer: "Wysyłaj bezpiecznie paczki od 2 do 15 kg. Jeśli zdarzy się, że celnik zatrzyma Twoją przesyłkę, na acbuy masz darmowe ubezpieczenie (w zaleznosci od lini), dzięki któremu otrzymasz zwrot środków w przypadku gdy twoja paczka zostanie zatrzymana/zgubiona",
    },
  ]

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 container mx-auto "> {/* Dodano bg-transparent */}
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 glow-text text-white">
        Najczęściej zadawane pytania (FAQ)
      </h2>

      <div className="max-w-3xl mx-auto">
        {faqItems.map((item, index) => (
          <FAQItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  )
}