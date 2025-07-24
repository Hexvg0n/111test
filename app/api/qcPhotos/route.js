// app/api/qcPhotos/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

const securityHeaders = {
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
};

/**
 * Przetwarza dane z API vectoreps na format oczekiwany przez frontend.
 * @param {object} apiData - Dane otrzymane z API.
 * @returns {Array} - Tablica grup zdjęć.
 */
const processPhotos = (apiData) => {
  const groups = [];

  if (apiData?.cnfans?.qc_data?.success && Array.isArray(apiData.cnfans.qc_data.data)) {
    // POPRAWKA: Dodajemy `index` do pętli, aby go użyć w tytule
    apiData.cnfans.qc_data.data.forEach((order, index) => {
      if (order.image_list && order.image_list.length > 0) {
        groups.push({
          // POPRAWKA: Zmiana nazwy wariantu na "Partia [numer]"
          variant: `Partia ${index + 1}`, 
          photos: order.image_list,
          timestamp: new Date().getTime() 
        });
      }
    });
  }
  
  return groups;
};

// ... reszta pliku pozostaje bez zmian (funkcje POST i OPTIONS)
export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body?.url) {
      return NextResponse.json({ 
        status: 'error', message: 'Link do produktu jest wymagany' 
      }, { status: 400, headers: securityHeaders });
    }

    const encodedUrl = encodeURIComponent(body.url);
    const apiUrl = `https://dev.vectoreps.pl/api/api/qc?url=${encodedUrl}`;

    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
      },
      timeout: 20000
    });

    if (!response.data.success) {
      throw new Error(response.data.msg || 'Błąd podczas pobierania danych z API QC');
    }

    const groups = processPhotos(response.data);

    if (groups.length === 0) {
        return NextResponse.json({
            status: 'error',
            message: 'Nie znaleziono zdjęć QC dla tego produktu w dostępnych źródłach.'
        }, { status: 404, headers: securityHeaders });
    }

    return NextResponse.json({ 
      status: 'success', 
      data: { groups } 
    }, { headers: securityHeaders });

  } catch (error) {
    console.error('API Error:', error);
    
    const errorMessage = error.response?.data?.message || error.message || 'Wewnętrzny błąd serwera';
    const errorStatus = error.response?.status || 500;

    return NextResponse.json({
      status: 'error',
      message: errorMessage
    }, {
      status: errorStatus,
      headers: securityHeaders
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      ...securityHeaders
    }
  });
}