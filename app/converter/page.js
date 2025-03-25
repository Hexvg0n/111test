// app/converter/page.js
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, ExternalLink, ArrowRight } from 'lucide-react';

const middlemenConfig = {
  kakobuy: { name: 'Kakobuy' },
  superbuy: { name: 'Superbuy' },
  cssbuy: { name: 'CSSBuy' },
  allchinabuy: { name: 'AllChinaBuy' },
  basetao: { name: 'Basetao' },
  lovegobuy: { name: 'LoveGoBuy' },
  cnfans: { name: 'CNFans' },
  joyabuy: { name: 'Joyabuy' },
  mulebuy: { name: 'Mulebuy' },
  hoobuy: { name: 'HooBuy' },
};

export default function ConverterPage() {
  const [inputUrl, setInputUrl] = useState('');
  const [convertedUrls, setConvertedUrls] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleConvert = async () => {
    if (!inputUrl.trim()) {
      showNotification('error', 'Proszę wkleić link');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/converter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });

      if (!response.ok) throw new Error('Błąd konwersji');
      
      const data = await response.json();
      setConvertedUrls(data);
    } catch (error) {
      showNotification('error', error.message || 'Nieznany błąd');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto pt-24 pb-16 px-4 md:px-6">
      <h1 className="text-3xl md:text-4xl font-semibold text-center mb-8 glow-text text-white">
        Konwerter Linków
      </h1>

      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          notification.type === "error" ? "bg-red-500" : "bg-green-500"
        } text-white`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white/5 rounded-xl p-6 mb-10">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            type="text"
            placeholder="Wklej link tutaj..."
            className="flex-1 bg-white/5 border-white/10 focus:border-white/30 text-white"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleConvert()}
          />
          <Button 
            onClick={handleConvert} 
            disabled={loading}
            className="bg-white text-black hover:bg-white/90"
          >
            {loading ? 'Konwertuję...' : 'Konwertuj'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {convertedUrls && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="all">Wszystkie linki</TabsTrigger>
              <TabsTrigger value="original">Oryginalny link</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {Object.entries(convertedUrls).map(([key, url]) => {
                if (key === 'original') return null;
                const middlemanName = middlemenConfig[key]?.name || key;

                return (
                  <div key={key} className="bg-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-white">{middlemanName}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigator.clipboard.writeText(url)}
                          className="text-white hover:text-white/80"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-white/80"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm truncate">{url}</p>
                  </div>
                );
              })}
            </TabsContent>

            <TabsContent value="original">
              {convertedUrls.original && (
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-white">Oryginalny link</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(convertedUrls.original)}
                        className="text-white hover:text-white/80"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <a
                        href={convertedUrls.original}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-white/80"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm break-all">
                    {convertedUrls.original}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}