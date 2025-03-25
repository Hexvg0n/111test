"use client"
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Package, TruckIcon, CheckCircle, AlertCircle, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

function TrackingStatus({ status }) {
  const statusMap = {
    delivered: { icon: CheckCircle, color: 'text-green-400', label: 'Doręczono' },
    in_transit: { icon: TruckIcon, color: 'text-blue-400', label: 'W drodze' },
    pending: { icon: Clock, color: 'text-yellow-400', label: 'Oczekuje' },
    exception: { icon: AlertCircle, color: 'text-red-400', label: 'Problem' }
  };

  const { icon: Icon, color, label } = statusMap[status] || statusMap.pending;
  
  return (
    <div className={`flex items-center gap-2 ${color} bg-white/5 px-4 py-2 rounded-full`}>
      <Icon className="h-5 w-5 shrink-0" />
      <span className="font-medium">{label}</span>
    </div>
  );
}

function TrackingEvent({ event, isLast }) {
  return (
    <div className="relative pl-8">
      {/* Punkt czasu */}
      <div className={`absolute left-8 top-0 -translate-x-1/2 w-4 h-4 flex items-center justify-center bg-background rounded-full border-4 border-white/10 z-10
        ${!isLast ? 'after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:w-0.5 after:h-8 after:bg-white/10' : ''}`}>
        <div className="w-2 h-2 bg-current rounded-full" />
      </div>

      {/* Treść zdarzenia */}
      <div className="ml-4 space-y-1 pb-8">
        <p className="text-base font-medium text-white leading-tight">{event.description}</p>
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-sm">
          <span className="text-white/60 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {event.date}
          </span>
          <span className="text-white/60 flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {event.location}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function TrackingDetails() {
  const { trackingNumber } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tracking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentCode: decodeURIComponent(trackingNumber) })
        });

        if (!response.ok) throw new Error('Błąd pobierania danych');
        
        const result = await response.json();
        
        if (!result['Informacje główne'] || !result['Szczegóły przesyłki']) {
          throw new Error('Nieprawidłowy format danych');
        }

        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [trackingNumber]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-white animate-spin" />
          <p className="text-lg text-white/70 animate-pulse">Ładowanie danych...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-500/20 p-8 rounded-xl space-y-6 text-center">
          <div className="space-y-2">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
            <h2 className="text-2xl font-bold text-red-400">Błąd</h2>
            <p className="text-white/90">{error || 'Nie udało się załadować danych'}</p>
          </div>
          <Button
            onClick={() => router.push('/tracking')}
            className="w-full bg-white/90 hover:bg-white text-black font-semibold py-6 text-lg"
          >
            Spróbuj ponownie
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="text-white/70 hover:text-white group px-0"
        >
          <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span className="text-lg">Wróć do listy przesyłek</span>
        </Button>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 space-y-8 border border-white/10">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-3 bg-white/10 rounded-xl">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {data['Informacje główne']?.['Numer śledzenia'] || 'Nieznany numer'}
                </h1>
                <p className="text-white/70 text-lg">{data?.Źródło}</p>
              </div>
            </div>
            <TrackingStatus status={data['Informacje główne']?.['Ostatni status']?.toLowerCase() || 'pending'} />
          </div>

          {/* Info Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Route Card */}
            <div className="bg-white/10 p-6 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="h-6 w-6 text-white/70" />
                <h3 className="text-xl font-semibold text-white">Trasa przesyłki</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-wider text-white/70">Kraj docelowy</p>
                  <p className="text-lg text-white">
                    {data['Informacje główne']?.Kraj || 'Brak danych'}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-wider text-white/70">Odbiorca</p>
                  <p className="text-lg text-white">
                    {data['Informacje główne']?.['Odbiorca'] || 'Brak danych'}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white/10 p-6 rounded-xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">Aktualny status</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Ostatnia aktualizacja:</span>
                  <span className="text-white text-lg">
                    {data['Informacje główne']?.Data || 'Nieznana'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Lokalizacja:</span>
                  <span className="text-white text-lg text-right">
                    {data['Szczegóły przesyłki']?.[0]?.Lokalizacja || 'Nieznana'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* History Section */}
          <div className="bg-white/10 p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-8">Historia przesyłki</h3>
          <div className="relative">
            {/* Główna linia czasu */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/10" />
            
            {/* Lista zdarzeń */}
            <div className="space-y-8">
              {data['Szczegóły przesyłki']?.map((event, index, array) => (
                <TrackingEvent
                  key={index}
                  event={{
                    description: event?.Status || 'Brak opisu',
                    date: event?.Data || 'Nieznana data',
                    location: event?.Lokalizacja || 'Nieznana lokalizacja'
                  }}
                  isLast={index === array.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}