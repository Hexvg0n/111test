// app/api/qcPhotos/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';

const KAKOBUY_ENDPOINT = 'https://open.kakobuy.com/open/pic/qcImage';
const API_SECRET = process.env.API_SECRET;
const KAKOBUY_TOKEN = process.env.KAKOBUY_TOKEN;
const AES_KEY = Buffer.from(process.env.AES_KEY, 'hex');
const AES_IV = Buffer.from(process.env.AES_IV, 'hex');

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
        { status: 'error', message: 'Invalid API key' },
        { status: 401, headers: securityHeaders }
      );
    }

    // Walidacja parametrów
    const { searchParams } = new URL(request.url);
    const goodsUrl = searchParams.get('goodsUrl');

    if (!goodsUrl) {
      return NextResponse.json(
        { status: 'error', message: 'Goods URL is required' },
        { status: 400, headers: securityHeaders }
      );
    }

    // Wywołanie Kakobuy API
    const response = await axios({
      method: 'GET',
      url: KAKOBUY_ENDPOINT,
      params: {
        token: KAKOBUY_TOKEN,
        goodsUrl: goodsUrl
      },
      timeout: 10000
    });

    // Obsługa błędów odpowiedzi
    if (response.data.status === 'error') {
      return handleKakobuyError(response.data.message);
    }

    // Deszyfrowanie URLi
    const decryptedData = response.data.data.map(item => ({
      ...item,
      image_url: decryptImageUrl(item.image_url)
    }));

    return NextResponse.json(
      { status: 'success', data: decryptedData },
      { headers: securityHeaders }
    );

  } catch (error) {
    return handleApiError(error, clientIP);
  }
}

// Funkcje pomocnicze
function decryptImageUrl(encryptedUrl) {
  try {
    const encryptedData = Buffer.from(encryptedUrl, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', AES_KEY, AES_IV);
    
    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString();
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

function handleKakobuyError(message) {
  const errorMap = {
    'Token is required': 401,
    'Invalid token': 403,
    'Daily query limit exceeded': 429,
    'Goods URL is required': 400,
    'Invalid goods URL': 400,
    'Product not found': 404,
    'No QC images found': 404
  };

  return NextResponse.json(
    { status: 'error', message },
    { status: errorMap[message] || 500, headers: securityHeaders }
  );
}

function handleApiError(error, clientIP) {
  let status = 500;
  let message = 'Internal server error';

  if (axios.isAxiosError(error)) {
    status = error.response?.status || 503;
    message = error.response?.data?.message || error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  console.error(`[${clientIP}] Error: ${message}`);
  return NextResponse.json(
    { status: 'error', message },
    { status, headers: securityHeaders }
  );
}

export async function OPTIONS() {
  return new Response(null, { headers: securityHeaders });
}