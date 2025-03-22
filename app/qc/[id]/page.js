// app/qc/[id]/page.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import QCGallery from '@/components/QCGallery';

export default function QCPage() {
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
    <div className="container mx-auto pt-24 pb-16 px-4 md:px-6">
      <Button variant="ghost" className="mb-6 text-white/70 hover:text-white" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Powrót
      </Button>

      <h1 className="text-3xl md:text-4xl font-semibold mb-8 glow-text text-white">Zdjęcia QC</h1>

      <div className="max-w-4xl mx-auto bg-white/5 rounded-xl p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-white animate-spin mb-4" />
            <p className="text-white/70">Ładowanie zdjęć QC...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-md">
            <p>{error}</p>
          </div>
        ) : qcData ? (
          <div>
            {qcData.length > 0 && (
              <h2 className="text-xl font-medium mb-6 text-white">
                {qcData[0].variant}
              </h2>
            )}
            <QCGallery groups={qcData} />
          </div>
        ) : (
          <div className="text-center py-12 text-white/70">
            <p>Nie znaleziono zdjęć QC</p>
          </div>
        )}
      </div>
    </div>
  )
}