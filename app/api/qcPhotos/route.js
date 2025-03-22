// app/api/qcPhotos/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

// Konfiguracja
const KAKOBUY_TOKEN = process.env.KAKOBUY_TOKEN || 'db70674ff41f4dda5266d09e8a275b04';
const API_TIMEOUT = 10000; // 10 sekund
const SUPPORTED_DOMAINS = [
  'taobao.com',
  'tmall.com',
  'weidian.com',
  '1688.com'
];

// Walidacja URL
const isValidProductUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return SUPPORTED_DOMAINS.some(domain => parsedUrl.hostname.includes(domain));
  } catch {
    return false;
  }
};

// Formatowanie błędów
const errorResponse = (message, status = 400) => {
  return NextResponse.json(
    { status: 'error', code: message.code, message: message.text },
    { status }
  );
};

const errorMessages = {
  missing_url: { code: 'MISSING_URL', text: 'URL produktu jest wymagany' },
  invalid_url: { code: 'INVALID_URL', text: 'Nieobsługiwany URL produktu' },
  api_failure: { code: 'API_FAILURE', text: 'Błąd zewnętrznego API' },
  invalid_data: { code: 'INVALID_DATA', text: 'Nieprawidłowy format danych' },
  server_error: { code: 'SERVER_ERROR', text: 'Wewnętrzny błąd serwera' }
};

export async function POST(request) {
  try {
    // Parsowanie body
    const body = await request.json().catch(() => null);
    if (!body) return errorResponse(errorMessages.missing_url);

    const { url } = body;
    
    // Walidacja URL
    if (!url) return errorResponse(errorMessages.missing_url);
    if (!isValidProductUrl(url)) {
      return errorResponse(errorMessages.invalid_url);
    }

    // Wywołanie API Kakobuy
    const response = await axios.get('https://open.kakobuy.com/open/pic/qcImage', {
      params: { token: KAKOBUY_TOKEN, goodsUrl: url },
      timeout: API_TIMEOUT,
      validateStatus: (status) => status < 500
    });

    // Obsługa odpowiedzi Kakobuy
    if (response.data.status === 'error') {
      return errorResponse({
        code: 'KAKOBUY_ERROR',
        text: response.data.message || 'Błąd zewnętrznego API'
      }, 502);
    }

    // Walidacja struktury danych
    if (!Array.isArray(response.data?.data)) {
      return errorResponse(errorMessages.invalid_data);
    }

    // Przetwarzanie zdjęć
    const photos = response.data.data
      .filter(item => item?.image_url?.startsWith('http'))
      .map(item => ({
        url: item.image_url,
        date: item.qc_date || 'Nieznana data',
        product: item.product_name || 'Brak nazwy produktu'
      }));

    if (photos.length === 0) {
      return errorResponse({
        code: 'NO_PHOTOS',
        text: 'Nie znaleziono zdjęć QC dla tego produktu'
      }, 404);
    }

    // Sukces
    return NextResponse.json({
      status: 'success',
      data: {
        count: photos.length,
        photos
      }
    });

  } catch (error) {
    console.error('API Error:', error);

    // Obsługa błędów Axios
    if (axios.isAxiosError(error)) {
      return errorResponse({
        code: 'NETWORK_ERROR',
        text: error.response?.data?.message || 'Błąd połączenia'
      }, error.response?.status || 503);
    }

    // Ogólny błąd serwera
    return errorResponse(errorMessages.server_error, 500);
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