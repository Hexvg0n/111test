// components/faq-section.js
"use client"

import { useState } from "react"
import Link from "next/link"
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
          <Link href="/how-to" className="text-white underline hover:text-white/90">
            How To
          </Link>
          . Tam znajdziesz szczegółowy przewodnik krok po kroku, który pomoże Ci bez problemu zrealizować zamówienie.
        </>
      ),
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