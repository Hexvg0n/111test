// app/qc/page.js
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import QCGallery from "@/components/QCGallery"; // Importujemy komponent galerii

export default function QCPage() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get('url');
  const [url, setUrl] = useState(initialUrl || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qcData, setQcData] = useState(null);

  // Efekt do uruchomienia wyszukiwania, jeśli URL jest w parametrach
  useEffect(() => {
    if (initialUrl) {
        handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl]);

  const handleSearch = async () => {
    if (!url.trim()) {
      setError("Wprowadź link do produktu");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setQcData(null);

    try {
      const response = await fetch("/api/qcPhotos", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (!response.ok || data.status === "error") {
        throw new Error(data.message || "Błąd podczas pobierania zdjęć QC");
      }

      if (data.data?.groups?.length > 0) {
        setQcData(data.data.groups);
      } else {
        setError("Nie znaleziono zdjęć QC dla tego produktu");
      }
    } catch (err) {
      setError(err.message || "Wystąpił nieoczekiwany błąd");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-[#0A0A0A] min-h-screen text-white selection:bg-rose-500/30 selection:text-white">
      <Navbar />
      {/* Efekty tła pozostają bez zmian */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[70vh] bg-gradient-to-br from-rose-500/10 via-purple-500/5 to-transparent" style={{ transform: "translate3d(0, 0, 0)", backfaceVisibility: "hidden", filter: "blur(20px)" }} />
        <div className="absolute bottom-0 right-0 w-full h-[50vh] bg-gradient-to-tl from-blue-500/10 via-indigo-500/5 to-transparent" style={{ transform: "translate3d(0, 0, 0)", backfaceVisibility: "hidden", filter: "blur(20px)" }} />
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
            Zdjęcia QC (Quality Control)
          </span>
        </h1>

        <div className="max-w-3xl mx-auto bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-xl p-8 mb-10 border border-zinc-800/50 shadow-xl shadow-rose-500/5">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-rose-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Wklej link do produktu..."
                className="flex-1 pl-12 py-6 bg-zinc-800/50 border-zinc-700/50 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 rounded-xl text-white transition-all"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white px-6 py-6 rounded-xl font-medium transition-all shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 min-w-[140px]"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Szukaj
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-300 p-4 rounded-xl mb-6 backdrop-blur-sm">
              <p>{error}</p>
            </div>
          )}

          {/* Wyświetlanie ładowania lub galerii */}
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-10 w-10 text-rose-400 animate-spin" />
            </div>
          ) : qcData && qcData.length > 0 ? (
            <QCGallery groups={qcData} />
          ) : null}
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
  );
}