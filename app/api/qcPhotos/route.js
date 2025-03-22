// app/api/qcPhotos/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

const API_SECRET = process.env.API_SECRET;
const KAKOBUY_TOKEN = process.env.KAKOBUY_TOKEN || 'db70674ff41f4dda5266d09e8a275b04';
const API_TIMEOUT = 10000;
const RATE_LIMIT = 100;

const rateLimits = new Map();

const securityHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'X-Content-Type-Options': 'nosniff'
};

export async function GET(request) {
  const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
  
  try {
    // Weryfikacja API Key
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || apiKey !== API_SECRET) {
      return NextResponse.json(
        { status: 'error', error: 'Invalid API key' },
        { status: 401, headers: securityHeaders }
      );
    }

    // Rate limiting
    const now = Date.now();
    const limit = rateLimits.get(clientIP) || { count: 0, lastReset: now };
    
    if (now - limit.lastReset > 86400000) {
      rateLimits.set(clientIP, { count: 1, lastReset: now });
    } else if (limit.count >= RATE_LIMIT) {
      return NextResponse.json(
        { status: 'error', error: 'Daily limit exceeded' },
        { status: 429, headers: securityHeaders }
      );
    } else {
      rateLimits.set(clientIP, { ...limit, count: limit.count + 1 });
    }

    // Walidacja parametrów
    const { searchParams } = new URL(request.url);
    const goodsUrl = searchParams.get('goodsUrl');

    if (!goodsUrl) {
      return NextResponse.json(
        { status: 'error', error: 'Missing goodsUrl parameter' },
        { status: 400, headers: securityHeaders }
      );
    }

    if (!isValidUrl(goodsUrl)) {
      return NextResponse.json(
        { status: 'error', error: 'Invalid product URL' },
        { status: 400, headers: securityHeaders }
      );
    }

    // Wywołanie Kakobuy API
    const response = await axios.get(
      'https://open.kakobuy.com/open/pic/qcImage',
      {
        params: {
          token: KAKOBUY_TOKEN,
          goodsUrl: goodsUrl
        },
        timeout: API_TIMEOUT,
        validateStatus: () => true
      }
    );

    // Obsługa błędów odpowiedzi
    if (response.status !== 200 || !Array.isArray(response.data)) {
      const errorData = response.data;
      return NextResponse.json(
        {
          status: 'error',
          error: errorData?.message || 'Invalid API response'
        },
        { status: 502, headers: securityHeaders }
      );
    }

    // Przetwarzanie danych
    const groups = processPhotos(response.data);
    
    return NextResponse.json(
      { status: 'success', data: groups },
      { headers: securityHeaders }
    );

  } catch (error) {
    // Zaawansowana obsługa błędów
    let errorMessage = 'Internal server error';
    let statusCode = 500;

    if (axios.isAxiosError(error)) {
      statusCode = error.response?.status || 503;
      errorMessage = error.response?.data?.error || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error(`[${clientIP}] Error: ${errorMessage}`);
    
    return NextResponse.json(
      { status: 'error', error: errorMessage },
      { status: statusCode, headers: securityHeaders }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, { headers: securityHeaders });
}

// Funkcje pomocnicze
function isValidUrl(url) {
  const patterns = [
    /^https?:\/\/(item\.taobao|detail\.tmall)\.com\/item\.htm\?id=\d+/,
    /^https?:\/\/weidian\.com\/item\.html\?itemID=\d+/,
    /^https?:\/\/detail\.1688\.com\/offer\/\d+\.html/
  ];
  return patterns.some(pattern => pattern.test(url));
}

function processPhotos(items) {
  const grouped = items.reduce((acc, item) => {
    try {
      const date = new Date(item.qc_date).toISOString().split('T')[0];
      const variant = item.product_name;

      if (!acc[date]) {
        acc[date] = {
          date,
          variant,
          photos: [],
          timestamp: new Date(item.qc_date).getTime()
        };
      }

      if (item.image_url.startsWith('http')) {
        acc[date].photos.push(item.image_url);
      }
      
      return acc;
    } catch (error) {
      console.error('Error processing item:', item);
      return acc;
    }
  }, {});

  return Object.values(grouped)
    .filter(group => group.photos.length > 0)
    .sort((a, b) => b.timestamp - a.timestamp);
}