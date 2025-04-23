"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ExternalLink, Check, ShoppingBag, Package, CreditCard, Truck, Search, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import Navbar from "@/components/navbar"

export default function HowToPage() {
  const [activeSection, setActiveSection] = useState(1)

  // YouTube Player API integration
  useEffect(() => {
    // Load the YouTube API script
    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

    // Initialize the player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player("youtube-player", {
        videoId: "dQw4w9WgXcQ", // Replace with your actual video ID
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          color: "white",
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            // Player is ready
            console.log("YouTube player is ready")
          },
          onStateChange: (event) => {
            // Player state has changed
          },
        },
      })
    }

    // Cleanup function
    return () => {
      // Remove the global callback
      delete window.onYouTubeIframeAPIReady

      // Remove any existing YouTube API script
      const youtubeScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
      if (youtubeScript) {
        youtubeScript.remove()
      }
    }
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(`section-${sectionId}`)
    if (element) {
      const yOffset = -100 // Offset to account for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
      setActiveSection(sectionId)
    }
  }

  return (
    <div className="relative bg-[#0A0A0A] min-h-screen text-white selection:bg-rose-500/30 selection:text-white">
      <Navbar />
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
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-rose-400 drop-shadow-[0_0_25px_rgba(244,63,94,0.2)]">
            Jak Zamawiać
          </span>
        </h1>

        {/* YouTube Video Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-xl p-4 border border-zinc-800/50 shadow-xl shadow-rose-500/5 overflow-hidden">
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
              <div id="youtube-player" className="absolute top-0 left-0 w-full h-full"></div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-white/80">
                Obejrzyj nasz szczegółowy poradnik wideo, który przeprowadzi Cię przez cały proces zamawiania.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-xl p-4 border border-zinc-800/50 sticky top-24">
              <h3 className="text-lg font-semibold mb-4 text-white">Spis treści</h3>
              <nav className="space-y-1">
                {[
                  { id: 1, title: "Rejestracja Konta", icon: <Check className="h-4 w-4" /> },
                  { id: 2, title: "Znalezienie Produktu", icon: <Search className="h-4 w-4" /> },
                  { id: 3, title: "Dodanie do Koszyka", icon: <ShoppingBag className="h-4 w-4" /> },
                  { id: 4, title: "Oczekiwanie na Dostawę", icon: <Package className="h-4 w-4" /> },
                  { id: 5, title: "Decyzja o Wysyłce", icon: <CreditCard className="h-4 w-4" /> },
                  { id: 6, title: "Wybór Metody Wysyłki", icon: <Truck className="h-4 w-4" /> },
                  { id: 7, title: "Śledzenie i Odbiór", icon: <MapPin className="h-4 w-4" /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors",
                      activeSection === item.id
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : "text-white/70 hover:text-white hover:bg-white/5",
                    )}
                  >
                    <span
                      className={cn(
                        "flex items-center justify-center w-6 h-6 rounded-full",
                        activeSection === item.id ? "bg-rose-500/20 text-rose-400" : "bg-zinc-800 text-white/70",
                      )}
                    >
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-zinc-800/50 shadow-xl shadow-rose-500/5">
              {/* Section 1 */}
              <section id="section-1" className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <Check className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                    Krok 1: Rejestracja Konta na KakoBuy
                  </h2>
                </div>
                <div className="space-y-4 text-white/80 ml-14">
                  <p className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-white/70 text-xs">
                      1
                    </span>
                    Wejdź na stronę rejestracji KakoBuy -
                    <a
                      href="https://ikako.vip/r/dripez"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-400 hover:text-rose-300 inline-flex items-center gap-1 transition-colors"
                    >
                      https://ikako.vip/r/dripez <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-white/70 text-xs">
                      2
                    </span>
                    Podaj swój adres e-mail, ustaw hasło, zaakceptuj warunki i kliknij "Rejestruj".
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section id="section-2" className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <Search className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                    Krok 2: Znalezienie Produktu na KakoBuy
                  </h2>
                </div>
                <div className="space-y-4 text-white/80 ml-14">
                  <p>
                    Aby znaleźć interesujące Cię przedmioty, możesz skorzystać z linków do produktów. Na mojej stronie
                    znajdują się w zakładce{" "}
                    <Link href="/w2c" className="text-rose-400 hover:text-rose-300 transition-colors">
                      W2C
                    </Link>
                    . Możesz także przeglądać spreedsheety u innych twórców w poszukiwaniu linków do interesujących Cię
                    przedmiotów. (u mnie i tak macie najlepiej 😉😉😉)
                  </p>
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                    <p className="font-medium text-white mb-2">Jeśli korzystasz z moich linków (W2C):</p>
                    <p>
                      Kliknij "Kup teraz" w prawym dolnym rogu – zostaniesz automatycznie przeniesiony na stronę
                      produktu u twojego agenta.
                    </p>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                    <p className="font-medium text-white mb-2">
                      Jeśli masz link z innych źródeł (spreadsheety, Discord itp.):
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>
                        Jeśli link prowadzi bezpośrednio do
                        <a
                          href="https://ikako.vip/r/dripez"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-rose-400 hover:text-rose-300 mx-1 inline-flex items-center gap-1 transition-colors"
                        >
                          KakoBuy <ExternalLink className="h-3 w-3" />
                        </a>
                        /
                        <a
                          href="https://cnfans.com/register/?ref=191373"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-rose-400 hover:text-rose-300 mx-1 inline-flex items-center gap-1 transition-colors"
                        >
                          cnfans <ExternalLink className="h-3 w-3" />
                        </a>
                        /etc. → po prostu go otwórz.
                      </li>
                      <li>
                        Jeśli chciałbyś przenieść link z np. z cnfansa na kakobuy → wklej go w{" "}
                        <Link href="/converter" className="text-rose-400 hover:text-rose-300 transition-colors">
                          konwerter
                        </Link>
                        , aby przekonwertować go na swoją platformę.
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="section-3" className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                    Krok 3: Dodanie do Koszyka i Złożenie Zamówienia
                  </h2>
                </div>
                <div className="space-y-4 text-white/80 ml-14">
                  <p>
                    Na stronie produktu wybierz rozmiar (jeśli jest dostępny). Czasami rozmiar wybierasz bezpośrednio z
                    listy, a czasami musisz zanotować swój rozmiar w uwagach do zamówienia. Jeśli nie jesteś pewien
                    rozmiaru, sprawdź tabele rozmiarów (jeśli są dostępne na stronie produktu) lub poszukaj informacji
                    na dedykowanych grupach. Możesz także sprawdzić{" "}
                    <Link href="/qc" className="text-rose-400 hover:text-rose-300 transition-colors">
                      Quality Checki (QC)
                    </Link>
                    , gdzie możesz zobaczyć wymiary ubrań i ich rzeczywiste zdjęcia.
                  </p>
                  <ol className="space-y-2 list-decimal list-inside">
                    <li>Kliknij "Dodaj do koszyka" lub "Kup teraz".</li>
                    <li>Przejdź do koszyka.</li>
                    <li>Zaznacz wybrane przedmioty.</li>
                    <li>
                      Kliknij "Saldo" a następnie "Złóż zamówienie", po zaznaczeniu opcji potwierdzającej zapoznanie się
                      z warunkami.
                    </li>
                    <li>
                      Wybierz metodę płatności. Dostępne opcje to między innymi karta, Google Pay, Apple Pay, a także
                      PayU (BLIK), ja polecam kartę bo jest po prostu najbezpieczniejsza. Możesz także płacić z salda
                      konta, jeśli je wcześniej doładujesz.
                    </li>
                    <li>
                      Potwierdź płatność. Pamiętaj, że ta pierwsza płatność jest tylko za produkty. Koszt wysyłki
                      zostanie opłacony później.
                    </li>
                  </ol>
                </div>
              </section>

              {/* Section 4 */}
              <section id="section-4" className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <Package className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                    Krok 4: Oczekiwanie na Dostawę do Magazynu KakoBuy i Quality Check (QC)
                  </h2>
                </div>
                <div className="space-y-4 text-white/80 ml-14">
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                    <p className="font-medium text-white mb-2">Statusy zamówienia:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">
                          Zapłacone
                        </span>
                        <span>Po zapłaceniu, status zamówienia zmieni się na "Zapłacone".</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs border border-indigo-500/20">
                          Zakupione
                        </span>
                        <span>Pracownicy KakoBuy zakupią przedmiot od sprzedawcy.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs border border-purple-500/20">
                          Wysłany w Chinach
                        </span>
                        <span>
                          Sprzedawca wyśle przedmiot do magazynu KakoBuy. Ten proces może trwać od 2 do 5 dni. Niektórzy
                          sprzedawcy mogą wysyłać przedmioty dłużej.
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs border border-rose-500/20">
                          Zaopatrzony
                        </span>
                        <span>Po dotarciu przedmiotu do magazynu, status zmieni się na "Zaopatrzony".</span>
                      </li>
                    </ul>
                  </div>
                  <p>
                    Pracownicy KakoBuy wykonają zdjęcia QC (Quality Check) Twojego produktu. Będziesz mógł zobaczyć te
                    zdjęcia w zakładce "Mój magazyn".
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section id="section-5" className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                    Krok 5: Podjęcie Decyzji o Wysyłce na KakoBuy
                  </h2>
                </div>
                <div className="space-y-4 text-white/80 ml-14">
                  <ol className="space-y-2 list-decimal list-inside">
                    <li>Sprawdź zdjęcia QC. Upewnij się, że przedmiot wygląda zgodnie z Twoimi oczekiwaniami.</li>
                    <li>Jeśli akceptujesz przedmiot, możesz przejść do jego wysyłki.</li>
                    <li>
                      Jeśli nie jesteś zadowolony ze zdjęć QC, możesz zdecydować się na zwrot towaru. opcja "Powrót"
                    </li>
                  </ol>
                </div>
              </section>

              {/* Section 6 */}
              <section id="section-6" className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <Truck className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                    Krok 6: Wybór Metody Wysyłki i Opłacenie Przesyłki na KakoBuy
                  </h2>
                </div>
                <div className="space-y-4 text-white/80 ml-14">
                  <ol className="space-y-2 list-decimal list-inside">
                    <li>
                      Gdy przedmioty są w magazynie i mają status "paczkę można składać", przejdź do "Mój magazyn" i
                      zaznacz przedmioty, które chcesz wysłać.
                    </li>
                    <li>Kliknij "Wyślij list przewozowy".</li>
                    <li>
                      Dodaj swój adres dostawy
                      <a
                        href="https://www.kakobuy.com/center/account?page=shippingAddress"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rose-400 hover:text-rose-300 mx-1 inline-flex items-center gap-1 transition-colors"
                      >
                        LINK <ExternalLink className="h-3 w-3" />
                      </a>
                      lub wybierz go, jeśli już go dodałeś. Aby dodać adres, kliknij w swój profil → User Center →
                      Account → Shipping address → Add the shipping address.
                    </li>
                    <li>
                      Możesz wybrać dodatkowe usługi pakowania takie jak Usuń opakowanie (np. pudełko butów), szczegóły
                      opakowania (np. ochrona na rogi). Zaleca się zaznaczenie Stretch Film, Moisture Bag oraz Corner
                      Protection. Następnie kliknij "prześlij teraz" i opłać wstępne ważenie. Po wstępnym ważeniu (około
                      12zł) paczka pojawi się w zakładce Rehearsal.
                    </li>
                    <li>Po zważeniu paczki i uzyskaniu zdjęć poglądowych, kliknij "Submit parcel".</li>
                    <li>
                      Wybierz linię lotniczą. Zgodnie z dostępnymi informacjami, najlepsze linie dostawy do Polski to
                      DPD (szybko do Warszawy i większych miast, zazwyczaj około 13 dni), DHL (szybko, porównywalne do
                      DPD, może być lepsze dla mniejszych miast), wybierz najtańszą, ponieważ nie powinno być różnicy w
                      szybkości dostawy.
                    </li>
                    <li className="font-semibold text-rose-300">
                      Zaznacz opcję "Buy Insurance" (kup ubezpieczenie) BARDZO WAŻNE.
                    </li>
                    <li>
                      Jeśli zarejestrowałeś się przez mój link, w zakładce "Centrum Osobiste"
                      <a
                        href="https://www.kakobuy.com/center/home"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rose-400 hover:text-rose-300 mx-1 inline-flex items-center gap-1 transition-colors"
                      >
                        LINK <ExternalLink className="h-3 w-3" />
                      </a>
                      wpisz kod "dripez", aby odblokować ekskluzywny rabat -60 zł na pierwsze zamówienie. Kod możesz
                      wybrać podczas finalizacji zamówienia, ale pamiętaj że jest jednorazowy i dostępny tylko dla
                      nowych użytkowników z mojego linku.
                    </li>
                    <li>Kliknij "Select" wybraną metodę wysyłki.</li>
                    <li>
                      Kliknij "Wyślij pakiet" i opłać koszt wysyłki. Możesz to zrobić za pomocą dostępnych metod
                      płatności, np. BLIK.
                    </li>
                  </ol>
                </div>
              </section>

              {/* Section 7 */}
              <section id="section-7" className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                    Krok 7: Śledzenie Przesyłki i Odbiór na KakoBuy
                  </h2>
                </div>
                <div className="space-y-4 text-white/80 ml-14">
                  <ol className="space-y-2 list-decimal list-inside">
                    <li>
                      Po wysłaniu paczki, numer śledzenia pojawi się w zakładce "Numer paczki". Status Twojej paczki
                      możesz śledzić bezpośrednio na KakoBuy lub u mnie w zakładce{" "}
                      <Link href="/tracking" className="text-rose-400 hover:text-rose-300 transition-colors">
                        tracking
                      </Link>
                      .
                    </li>
                    <li>Czas dostawy zależy od wybranej linii lotniczej.</li>
                    <li>Po otrzymaniu paczki, możesz potwierdzić jej odbiór w systemie KakoBuy.</li>
                  </ol>
                </div>
              </section>

              {/* Summary */}
              <div className="mt-16 bg-gradient-to-r from-rose-500/10 to-purple-500/10 rounded-xl p-6 border border-rose-500/20">
                <h3 className="text-xl font-semibold mb-4 text-white">Podsumowanie</h3>
                <p className="text-white/80">
                  Proces zamawiania może wydawać się skomplikowany na początku, ale z czasem staje się bardzo prosty.
                  Pamiętaj, że zawsze możesz wrócić do tego poradnika, jeśli będziesz mieć jakiekolwiek wątpliwości.
                  Jeśli masz dodatkowe pytania, możesz skontaktować się ze mną przez Discord lub sprawdzić sekcję FAQ.
                </p>
                <div className="mt-4 flex flex-wrap gap-4">
                  <Link
                    href="/w2c"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 rounded-lg text-white font-medium transition-all shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Przeglądaj produkty
                  </Link>
                  <Link
                    href="/tracking"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800/80 hover:bg-zinc-700/80 rounded-lg text-white/90 hover:text-white font-medium transition-colors border border-zinc-700/50"
                  >
                    <Truck className="h-4 w-4" />
                    Śledź przesyłkę
                  </Link>
                </div>
              </div>
            </div>
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
