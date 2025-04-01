'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Search, ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import QCGallery from '@/components/QCGallery';
import { cn } from "@/lib/utils";

export default function QCDetailPage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qcData, setQcData] = useState(null);

  const handleSearch = async () => {
    if (!url.trim()) {
      setError("Wprowadź link do produktu");
      return;
    }

    setIsLoading(true);
    setError(null);
    setQcData(null);

    try {
      const response = await fetch('/api/qcPhotos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_API_SECRET || '',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || "Wystąpił błąd podczas pobierania zdjęć QC");
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
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top gradient */}
        <div className="absolute top-0 left-0 w-full h-[70vh] bg-gradient-to-br from-rose-500/10 via-purple-500/5 to-transparent transform translate-y-0" 
          style={{
            transform: "translate3d(0, 0, 0)",
            backfaceVisibility: "hidden"
          }}
        />
        
        {/* Bottom gradient */}
        <div className="absolute bottom-0 right-0 w-full h-[50vh] bg-gradient-to-tl from-blue-500/10 via-indigo-500/5 to-transparent transform translate-y-0"
          style={{
            transform: "translate3d(0, 0, 0)",
            backfaceVisibility: "hidden"
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
        <Button 
          variant="ghost" 
          className="mb-6 text-white/70 hover:text-white group" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
          Powrót
        </Button>

        <h1 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-rose-400 drop-shadow-[0_0_25px_rgba(244,63,94,0.2)]">
            Zdjęcia QC
          </span>
        </h1>

        <div className="max-w-4xl mx-auto bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-xl p-8 border border-zinc-800/50 shadow-xl shadow-rose-500/5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
                <Loader2 className="h-10 w-10 text-rose-400 animate-spin" />
              </div>
              <p className="text-white/70">Ładowanie zdjęć QC...</p>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-500/50 text-red-300 p-6 rounded-xl backdrop-blur-sm">
              <p className="text-center">{error}</p>
            </div>
          ) : qcData ? (
            <div>
              {qcData.length > 0 && (
                <h2 className="text-xl font-semibold mb-6 text-white">
                  {qcData[0].variant}
                </h2>
              )}
              <QCGallery groups={qcData} />
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="h-10 w-10 text-white/30" />
              </div>
              <p className="text-white/70">Nie znaleziono zdjęć QC</p>
            </div>
          )}
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
