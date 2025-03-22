// app/api/qcPhotos/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

const ALLOWED_ORIGINS = [
  'https://hxgn.pl',
  'https://www.hxgn.pl',
  'http://localhost:3000'
];

const API_SECRET = process.env.API_SECRET;
const API_TIMEOUT = 10000;
const FALLBACK_ERROR_MESSAGE = 'System error, please try again later';

const securityHeaders = (origin) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
});

const validateApiResponse = (data) => {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid API structure' };
  }

  if (data.status === 'error') {
    return {
      valid: false,
      error: data.message || FALLBACK_ERROR_MESSAGE,
      isApiError: true
    };
  }

  if (!data.data || !Array.isArray(data.data)) {
    return { valid: false, error: 'Invalid data format' };
  }

  return { valid: true };
};

const processPhotos = (apiData) => {
  try {
    const groupedPhotos = apiData.data.reduce((acc, item) => {
      try {
        const imageUrl = item?.image_url?.trim();
        if (!imageUrl?.startsWith('http')) return acc;

        const qcDate = item?.qc_date?.split(' ')[0] || 'no-date';
        const batch = item?.batch ? `Batch: ${item.batch} | ` : '';
        const variant = `${batch}QC ${qcDate}`;

        acc[qcDate] = acc[qcDate] || {
          variant,
          photos: [],
          timestamp: new Date(qcDate).getTime() || Date.now()
        };

        acc[qcDate].photos.push(imageUrl);
        return acc;
      } catch (error) {
        console.error('Item processing error:', error);
        return acc;
      }
    }, {});

    return Object.values(groupedPhotos)
      .filter(group => group.photos?.length > 0)
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Processing error:', error);
    return [];
  }
};

export async function OPTIONS(request) {
  const origin = request.headers.get('origin');
  const headers = ALLOWED_ORIGINS.includes(origin) 
    ? securityHeaders(origin)
    : {};

  return new NextResponse(null, {
    status: 204,
    headers
  });
}

export async function POST(request) {
  const origin = request.headers.get('origin');
  const clientIP = request.headers.get('x-forwarded-for') || 'unknown';

  if (!ALLOWED_ORIGINS.includes(origin)) {
    console.warn(`Blocked request from invalid origin: ${origin} (IP: ${clientIP})`);
    return NextResponse.json(
      { status: 'error', code: 'origin_blocked', message: 'Access denied' },
      { status: 403 }
    );
  }

  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== API_SECRET) {
    console.warn(`Invalid API key attempt from: ${origin} (IP: ${clientIP})`);
    return NextResponse.json(
      { status: 'error', code: 'invalid_key', message: 'Unauthorized' },
      { status: 401, headers: securityHeaders(origin) }
    );
  }

  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json(
        { status: 'error', code: 'missing_url', message: 'URL parameter required' },
        { status: 400, headers: securityHeaders(origin) }
      );
    }

    const response = await axios.get('https://open.kakobuy.com/open/pic/qcImage', {
      params: { token: process.env.KAKOBUY_TOKEN, goodsUrl: url },
      timeout: API_TIMEOUT,
      validateStatus: (status) => status < 500
    });

    const validation = validateApiResponse(response.data);
    if (!validation.valid) {
      console.error('API validation failed:', {
        url,
        status: response.status,
        validationError: validation.error
      });
      
      return NextResponse.json(
        { status: 'error', code: 'invalid_response', message: validation.error },
        { status: 400, headers: securityHeaders(origin) }
      );
    }

    const groupsData = processPhotos(response.data);
    if (!groupsData.length) {
      return NextResponse.json(
        { status: 'error', code: 'no_data', message: 'No QC photos found' },
        { status: 404, headers: securityHeaders(origin) }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: {
        count: groupsData.length,
        groups: groupsData
      },
      meta: {
        source: 'kakobuy',
        timestamp: new Date().toISOString()
      }
    }, {
      headers: securityHeaders(origin)
    });

  } catch (error) {
    console.error('API error:', {
      error: error.message,
      stack: error.stack
    });

    const statusCode = axios.isAxiosError(error) 
      ? error.response?.status || 503 
      : 500;

    return NextResponse.json(
      { status: 'error', code: 'server_error', message: FALLBACK_ERROR_MESSAGE },
      { status: statusCode, headers: securityHeaders(origin) }
    );
  }
}