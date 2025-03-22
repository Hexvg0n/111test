// components/QCGallery.js
'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Calendar, ExternalLink } from 'lucide-react';

export default function QCGallery({ groups, initialGroup = 0 }) {
  const [activeGroup, setActiveGroup] = useState(initialGroup);
  const [activePhoto, setActivePhoto] = useState(
    groups[initialGroup]?.photos[0] || null
  );

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <h3 className="text-lg font-medium mb-4 text-white">Dostępne partie zdjęć</h3>
          <div className="space-y-2">
            {groups.map((group, index) => (
              <button
                key={group.variant}
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
              <div className="relative aspect-square bg-black/50 rounded-lg overflow-hidden mb-4">
                <Image
                  src={activePhoto}
                  alt="QC Photo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <a
                  href={activePhoto}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 text-white" />
                </a>
              </div>

              {/* Miniatury */}
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                {groups[activeGroup].photos.map((photo) => (
                  <button
                    key={photo}
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
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}