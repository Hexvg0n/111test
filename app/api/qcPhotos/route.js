import { NextResponse } from 'next/server';
import axios from 'axios';

const KAKOBUY_TOKEN = process.env.KAKOBUY_TOKEN;
const API_TIMEOUT = 15000;
const RATE_LIMIT = 100;
const ipRequestCounts = new Map();

const URL_PATTERNS = [
  /^https?:\/\/(item\.taobao|detail\.tmall)\.com\/item\.htm\?.*id=\d+/i,
  /^https?:\/\/weidian\.com\/item\.html\?.*itemID=\d+/i,
  /^https?:\/\/detail\.1688\.com\/offer\/\d+\.html/i
];

const createResponse = (data, status = 200) => {
  return NextResponse.json(data, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    }
  });
};

const errorResponse = (error, status = 400) => {
  return createResponse(
    {
      status: 'error',
      code: error.code,
      message: error.message,
      details: error.details
    },
    status
  );
};

const errors = {
  invalid_json: {
    code: 'INVALID_JSON',
    message: 'Nieprawidłowy format danych',
    details: 'Wysyłane dane muszą być w formacie JSON'
  },
  missing_url: {
    code: 'MISSING_URL',
    message: 'Brak wymaganego parametru URL'
  },
  invalid_url: {
    code: 'INVALID_URL',
    message: 'Nieobsługiwany URL produktu'
  },
  rate_limit: {
    code: 'RATE_LIMIT',
    message: 'Przekroczony limit zapytań'
  },
  provider_error: {
    code: 'PROVIDER_ERROR',
    message: 'Błąd zewnętrznego dostawcy'
  }
};

export async function POST(request) {
  const clientIP = request.headers.get('x-forwarded-for') || 'unknown';

  try {
    // Sprawdź limit zapytań
    const requestCount = ipRequestCounts.get(clientIP) || 0;
    if (requestCount >= RATE_LIMIT) {
      return errorResponse(errors.rate_limit, 429);
    }
    ipRequestCounts.set(clientIP, requestCount + 1);

    // Parsuj i waliduj żądanie
    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse(errors.invalid_json, 400);
    }

    if (!body?.url) {
      return errorResponse(errors.missing_url, 400);
    }

    if (!URL_PATTERNS.some(pattern => pattern.test(body.url))) {
      return errorResponse(errors.invalid_url, 400);
    }

    // Wywołaj zewnętrzne API
    const response = await axios.get('https://open.kakobuy.com/open/pic/qcImage', {
      params: {
        token: KAKOBUY_TOKEN,
        goodsUrl: body.url
      },
      timeout: API_TIMEOUT,
      responseType: 'json'
    });

    // Przetwórz odpowiedź
    const items = response.data?.data?.filter(item => 
      item?.image_url?.startsWith('https://')
    ) || [];

    if (items.length === 0) {
      return createResponse({
        status: 'success',
        data: { photos: [] }
      });
    }

    return createResponse({
      status: 'success',
      data: {
        photos: items.map(item => ({
          url: item.image_url,
          date: item.qc_date,
          product: item.product_name
        }))
      }
    });

  } catch (error) {
    console.error('Błąd API:', error);
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
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}