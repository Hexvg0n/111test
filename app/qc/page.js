"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2, ExternalLink, Calendar, ImageIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";

export default function QCPage() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get('url');
  const [url, setUrl] = useState(initialUrl || "");
  const [isLoading, setIsLoading] = useState(!!initialUrl);
  const [error, setError] = useState(null);
  const [qcData, setQcData] = useState(null);
  const [activeGroup, setActiveGroup] = useState(0);
  const [activePhoto, setActivePhoto] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const GROUPS_PER_PAGE = 6;

  useEffect(() => {
    if (initialUrl) handleSearch();
  }, []);

  const handleSearch = async () => {
    if (!url.trim()) return setError("Wprowadź link do produktu");
    
    setIsLoading(true);
    setError(null);
    setQcData(null);

    try {
      const response = await fetch("/api/qcPhotos", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-API-Key": process.env.NEXT_PUBLIC_API_SECRET 
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (!response.ok || data.status === "error") {
        throw new Error(data.error || "Błąd podczas pobierania zdjęć QC");
      }

      if (data.data?.groups?.length > 0) {
        setQcData(data.data.groups);
        setActiveGroup(0);
        setActivePhoto(data.data.groups[0].photos[0]);
      } else {
        setError("Nie znaleziono zdjęć QC dla tego produktu");
      }
    } catch (err) {
      setError(err.message || "Wystąpił nieoczekiwany błąd");
    } finally {
      setIsLoading(false);
    }
  };

  const currentGroups = qcData?.slice(
    (currentPage - 1) * GROUPS_PER_PAGE,
    currentPage * GROUPS_PER_PAGE
  );

  return (
    <div className="relative bg-[#0A0A0A] min-h-screen text-white selection:bg-rose-500/30 selection:text-white">
      <Navbar />
      {/* Keep original background effects */}
      <div className="container mx-auto pt-24 pb-16 px-4 md:px-6 relative z-20">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-rose-400 drop-shadow-[0_0_25px_rgba(244,63,94,0.2)]">
            Zdjęcia QC (Quality Control)
          </span>
        </h1>

        {/* Search Section */}
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

          {/* Gallery Section */}
          {qcData && (
            <div className="mt-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Group Selection */}
                <div className="w-full md:w-64 shrink-0">
                  <h3 className="text-lg font-semibold mb-4 text-white">Dostępne partie zdjęć</h3>
                  <div className="space-y-2">
                    {currentGroups.map((group, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setActiveGroup(index);
                          setActivePhoto(group.photos[0]);
                        }}
                        className={cn(
                          "w-full text-left p-3 rounded-lg flex items-center border transition-colors",
                          activeGroup === index
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-100"
                            : "bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700/50 text-white/80 hover:text-white"
                        )}
                      >
                        <Calendar className={cn(
                          "h-4 w-4 mr-2",
                          activeGroup === index ? "text-rose-400" : "text-white/60"
                        )} />
                        <div>
                          <p className="text-sm font-medium">{group.variant}</p>
                          <p className="text-xs opacity-70">{group.photos.length} zdjęć</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {qcData.length > GROUPS_PER_PAGE && (
                    <div className="mt-4 flex justify-between items-center">
                      <Button
                        variant="ghost"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="text-rose-400 hover:bg-rose-500/10"
                      >
                        Poprzednia
                      </Button>
                      <span className="text-sm text-rose-300">Strona {currentPage}</span>
                      <Button
                        variant="ghost"
                        disabled={currentPage * GROUPS_PER_PAGE >= qcData.length}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="text-rose-400 hover:bg-rose-500/10"
                      >
                        Następna
                      </Button>
                    </div>
                  )}
                </div>

                {/* Photo Display */}
                <div className="flex-1">
                  {/* Keep original photo display logic */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}