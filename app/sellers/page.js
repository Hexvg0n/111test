"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Star, StarHalf, User, Loader2, Pin } from "lucide-react"; // Dodano Pin
import Navbar from "@/components/navbar";

export default function SellersPage() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await fetch("/api/sellers");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Wystąpił błąd podczas pobierania danych");
        }
        const fetchedSellers = data.data || [];
        // Sortuj sprzedawców: przypięci najpierw, potem alfabetycznie
        fetchedSellers.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return (a.name || "").localeCompare(b.name || "");
        });
        setSellers(fetchedSellers);
      } catch (error) {
        console.error("Error fetching sellers:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, []);

  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-rose-500 text-rose-500" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 fill-rose-500 text-rose-500" />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-zinc-600" />
        ))}
        <span className="ml-2 text-white/70 text-sm">
          {rating % 1 === 0 ? rating.toFixed(0) : rating.toFixed(1)}/5
        </span>
      </div>
    );
  };

  return (
    <div className="relative bg-[#0A0A0A] min-h-screen text-white selection:bg-rose-500/30 selection:text-white">
      <Navbar />
      {/* Background elements - bez zmian */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-[70vh] bg-gradient-to-br from-rose-500/10 from-10% via-purple-500/5 via-40% to-transparent to-90%"
          style={{ transform: "translate3d(0, 0, 0)", backfaceVisibility: "hidden", filter: "blur(20px)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-full h-[50vh] bg-gradient-to-tl from-purple-500/10 from-10% via-indigo-500/5 via-40% to-transparent to-90%"
          style={{ transform: "translate3d(0, 0, 0)", backfaceVisibility: "hidden", filter: "blur(20px)" }}
        />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-rose-500/5 blur-3xl animate-float-slow" />
          <div className="absolute top-3/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl animate-float-medium" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl animate-float-fast" />
        </div>
      </div>
      <div className="fixed inset-0 bg-[url('/placeholder.svg?height=200&width=200')] opacity-[0.03] pointer-events-none z-10" />
      
      <div className="container mx-auto pt-24 pb-16 px-4 md:px-6 relative z-20">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-rose-400 drop-shadow-[0_0_25px_rgba(244,63,94,0.2)]">
            Zaufani Sprzedawcy
          </span>
        </h1>
        <p className="text-center mb-12 max-w-3xl mx-auto text-white/70">
          Poniżej znajdziesz listę sprawdzonych sprzedawców, od których możesz bezpiecznie zamawiać. Każdy z nich został
          zweryfikowany pod kątem jakości produktów i obsługi klienta.
        </p>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-rose-500 animate-spin mb-4" />
            <p className="text-white/70">Ładowanie sprzedawców...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500/50 text-red-300 p-6 rounded-xl backdrop-blur-sm max-w-xl mx-auto">
            <p className="text-center font-medium mb-2">Wystąpił błąd podczas ładowania danych</p>
            <p className="text-center text-sm">{error}</p>
          </div>
        ) : sellers.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-xl border border-zinc-800/50 max-w-xl mx-auto">
            <User className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-xl font-medium text-white mb-2">Brak sprzedawców</p>
            <p className="text-white/60">Aktualnie nie ma żadnych sprzedawców w bazie danych.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map((seller) => (
              <div
                key={seller._id}
                className="bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-xl overflow-hidden border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 hover:translate-y-[-8px] hover:shadow-lg hover:shadow-rose-500/10 flex flex-col"
              >
                {seller.image ? (
                  <div className="relative h-48 w-full">
                    <Image
                      src={seller.image}
                      alt={seller.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        e.target.src = "/default-seller.jpg"; // Fallback image
                        e.target.className = "object-cover";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 inline-block">
                        {renderRating(seller.rating || 0)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 w-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center relative">
                    <User className="h-16 w-16 text-zinc-700" />
                    <div className="absolute bottom-4 left-4 right-4">
                       <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 inline-block">
                         {renderRating(seller.rating || 0)}
                       </div>
                     </div>
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-semibold mb-2 text-white flex items-center">
                    {seller.isPinned && (
                      <Pin className="h-5 w-5 text-yellow-400 mr-2 shrink-0" title="Przypięty sprzedawca"/>
                    )}
                    {seller.name}
                  </h2>
                  {seller.description && (
                    <p className="text-white/70 text-sm mb-4 flex-1">{seller.description}</p>
                  )}
                  <a
                    href={seller.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors font-medium"
                  >
                    Odwiedź sklep <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Sekcja "Jak wybieramy sprzedawców?" - bez zmian */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            Jak wybieramy sprzedawców?
          </h2>
          <div className="bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-zinc-800/50">
            <p className="text-white/80 mb-4">
              Każdy sprzedawca na naszej liście przechodzi dokładny proces weryfikacji, który obejmuje:
            </p>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-rose-400 text-sm font-bold">1</span>
                </div>
                <p>Sprawdzenie jakości produktów poprzez zamówienia testowe i analizę zdjęć QC</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-rose-400 text-sm font-bold">2</span>
                </div>
                <p>Weryfikację opinii innych kupujących i społeczności</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-rose-400 text-sm font-bold">3</span>
                </div>
                <p>Ocenę komunikacji i czasu realizacji zamówień</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-rose-400 text-sm font-bold">4</span>
                </div>
                <p>Stosunek jakości do ceny oferowanych produktów</p>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-rose-500/10 rounded-lg border border-rose-500/20">
              <p className="text-white/90 text-sm">
                <strong className="text-rose-400">Uwaga:</strong> Pamiętaj, że nawet najlepsi sprzedawcy mogą czasem
                mieć gorsze partie produktów. Zawsze sprawdzaj zdjęcia QC przed wysyłką i korzystaj z naszej sekcji{" "}
                <Link href="/qc" className="text-rose-400 hover:text-rose-300 transition-colors">
                  QC
                </Link>
                , aby zobaczyć rzeczywiste zdjęcia produktów.
              </p>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes floatSlow { 0% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(-20px, 20px) rotate(5deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
        @keyframes floatMedium { 0% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(30px, -20px) rotate(-5deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
        @keyframes floatFast { 0% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(-15px, -25px) rotate(7deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
        .animate-float-slow { animation: floatSlow 20s ease-in-out infinite; }
        .animate-float-medium { animation: floatMedium 15s ease-in-out infinite; }
        .animate-float-fast { animation: floatFast 12s ease-in-out infinite; }
      `}</style>
    </div>
  );
}