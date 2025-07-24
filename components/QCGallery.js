// components/QCGallery.js
'use client';
import { useState } from 'react';
import Image from 'next/image';
// POPRAWKA: Zmieniamy import ikony
import { Calendar, X as CloseIcon } from 'lucide-react';

export default function QCGallery({ groups, initialGroup = 0 }) {
  const [activeGroup, setActiveGroup] = useState(initialGroup);
  const [activePhoto, setActivePhoto] = useState(
    groups[initialGroup]?.photos[0] || null
  );
  // POPRAWKA: Nowy stan do obsługi powiększenia (lightboxa)
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <div className="mt-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <h3 className="text-lg font-medium mb-4 text-white">Dostępne partie zdjęć</h3>
            <div className="space-y-2">
              {groups.map((group, index) => (
                <button
                  key={`${group.variant}-${index}`}
                  onClick={() => {
                    setActiveGroup(index);
                    setActivePhoto(group.photos[0]);
                  }}
                  className={`w-full text-left p-3 rounded-md flex items-center ${
                    activeGroup === index
                      ? "bg-white/20 border-white/30"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  } border transition-colors`}
                >
                  <Calendar className="h-4 w-4 mr-2 opacity-70" />
                  <div>
                    <p className="text-sm font-medium">{group.variant}</p>
                    <p className="text-xs opacity-70">{group.photos.length} zdjęć</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Główny obszar */}
          <div className="flex-1">
            {activeGroup !== null && activePhoto && (
              <>
                {/* POPRAWKA: Dodajemy onClick i kursor, usuwamy link zewnętrzny */}
                <div 
                  className="relative aspect-square bg-black/50 rounded-lg overflow-hidden mb-4 cursor-pointer"
                  onClick={() => setIsZoomed(true)}
                >
                  <Image
                    src={activePhoto}
                    alt="QC Photo"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                  />
                </div>

                {/* Miniatury */}
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {groups[activeGroup].photos.map((photo, photoIndex) => (
                    <button
                      key={`${photo}-${photoIndex}`}
                      onClick={() => setActivePhoto(photo)}
                      className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                        activePhoto === photo ? "border-white" : "border-transparent"
                      }`}
                    >
                      <Image
                        src={photo}
                        alt="Thumbnail"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, 10vw"
                        placeholder="blur"
                        blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* POPRAWKA: Całkowicie nowy blok kodu dla powiększonego zdjęcia (lightbox) */}
      {isZoomed && activePhoto && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsZoomed(false)} // Zamykanie po kliknięciu w tło
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-rose-400 transition-colors z-50"
            onClick={() => setIsZoomed(false)}
          >
            <CloseIcon size={32} />
          </button>

          {/* Kontener na zdjęcie, aby uniknąć zamykania po kliknięciu na nim */}
          <div className="relative w-[95vw] h-[90vh]" onClick={(e) => e.stopPropagation()}>
             <Image
                src={activePhoto}
                alt="Powiększone zdjęcie QC"
                fill
                className="object-contain"
                sizes="95vw"
            />
          </div>
        </div>
      )}
    </>
  );
}