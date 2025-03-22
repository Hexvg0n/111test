// app/api/qcPhotos/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

// Konfiguracja
const KAKOBUY_TOKEN = process.env.KAKOBUY_TOKEN;
const API_TIMEOUT = 15000; // 15 sekund
const RATE_LIMIT = 100; // 100 requestów na IP dziennie
const ipRequestCounts = new Map();

// Wzorce URL
const URL_PATTERNS = [
  // Taobao/Tmall
  /^https?:\/\/(item\.taobao|detail\.tmall)\.com\/item\.htm\?.*id=\d+/i,
  // Weidian
  /^https?:\/\/weidian\.com\/item\.html\?.*itemID=\d+/i,
  // 1688
  /^https?:\/\/detail\.1688\.com\/offer\/\d+\.html/i
];

// Walidacja URL
const isValidProductUrl = (url) => {
  try {
    return URL_PATTERNS.some(pattern => pattern.test(url));
  } catch {
    return false;
  }
};

// Formaty błędów
const errorResponse = (error, status = 400) => {
  return NextResponse.json(
    {
      status: 'error',
      code: error.code,
      message: error.message,
      details: error.details
    },
    { status }
  );
};

const errors = {
  missing_url: {
    code: 'MISSING_URL',
    message: 'Brak wymaganego parametru URL',
    details: 'W żądaniu brakuje parametru z URL produktu'
  },
  invalid_url: {
    code: 'INVALID_URL',
    message: 'Nieprawidłowy URL produktu',
    details: 'URL musi pochodzić z Taobao, Tmall, Weidian lub 1688'
  },
  rate_limit: {
    code: 'RATE_LIMIT',
    message: 'Przekroczony limit zapytań',
    details: `Maksymalnie ${RATE_LIMIT} zapytań dziennie na IP`
  },
  kakobuy_error: {
    code: 'KAKOBUY_ERROR',
    message: 'Błąd zewnętrznego dostawcy'
  },
  invalid_data: {
    code: 'INVALID_DATA',
    message: 'Nieprawidłowy format danych'
  }
};

export async function POST(request) {
  const clientIP = request.headers.get('x-forwarded-for') || 'unknown';

  try {
    // Walidacja środowiska
    if (!KAKOBUY_TOKEN) {
      console.error('Brak tokenu Kakobuy w zmiennych środowiskowych');
      throw new Error('Konfiguracja serwera niekompletna');
    }

    // Rate limiting
    const currentCount = ipRequestCounts.get(clientIP) || 0;
    if (currentCount >= RATE_LIMIT) {
      return errorResponse(errors.rate_limit, 429);
    }
    ipRequestCounts.set(clientIP, currentCount + 1);

    // Parsowanie żądania
    const body = await request.json().catch(() => null);
    if (!body || !body.url) {
      return errorResponse(errors.missing_url);
    }

    const productUrl = body.url.trim();

    // Walidacja URL
    if (!isValidProductUrl(productUrl)) {
      return errorResponse(errors.invalid_url);
    }

    // Wywołanie API Kakobuy
    const response = await axios.get('https://open.kakobuy.com/open/pic/qcImage', {
      params: {
        token: KAKOBUY_TOKEN,
        goodsUrl: productUrl
      },
      timeout: API_TIMEOUT,
      validateStatus: (status) => status < 500
    });

    // Obsługa odpowiedzi Kakobuy
    if (response.status !== 200 || response.data.status === 'error') {
      console.error('Błąd Kakobuy:', {
        status: response.status,
        data: response.data
      });
      
      return errorResponse({
        ...errors.kakobuy_error,
        details: response.data?.message || 'Nieznany błąd dostawcy'
      }, 502);
    }

    // Walidacja struktury danych
    if (!Array.isArray(response.data.data)) {
      console.error('Nieprawidłowa struktura danych:', response.data);
      return errorResponse(errors.invalid_data);
    }

    // Przetwarzanie zdjęć
    const photos = response.data.data
      .filter(item => item?.image_url?.startsWith('https://'))
      .map(item => ({
        url: item.image_url,
        date: item.qc_date ? new Date(item.qc_date).toISOString() : null,
        product: item.product_name || 'Brak nazwy produktu'
      }));

    if (photos.length === 0) {
      return errorResponse({
        code: 'NO_PHOTOS',
        message: 'Brak dostępnych zdjęć QC',
        details: 'Dla tego produktu nie znaleziono zdjęć kontroli jakości'
      }, 404);
    }

    // Sukces
    return NextResponse.json({
      status: 'success',
      data: {
        count: photos.length,
        photos
      },
      meta: {
        source: 'kakobuy',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Błąd API:', {
      ip: clientIP,
      error: error.message,
      stack: error.stack
    });

    if (axios.isAxiosError(error)) {
      return errorResponse({
        code: 'NETWORK_ERROR',
        message: 'Błąd połączenia',
        details: error.message
      }, 503);
    }

    return errorResponse({
      code: 'SERVER_ERROR',
      message: 'Wewnętrzny błąd serwera',
      details: error.message
    }, 500);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}