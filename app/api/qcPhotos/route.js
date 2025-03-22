// app/api/qcPhotos/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

const ALLOWED_DOMAINS = [
  'hxgn.pl',
  'www.hxgn.pl',
  'localhost:3000'
];

const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 100 // Limit do 100 żądań na IP
};

const ipRequests = new Map();

export async function OPTIONS(request) {
  const origin = request.headers.get('origin') || '';
  const allowed = ALLOWED_DOMAINS.some(domain => origin.includes(domain));
  
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowed ? origin : '',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin'
    }
  });
}

export async function POST(request) {
  try {
    // Weryfikacja Origin
    const origin = request.headers.get('origin') || '';
    const originDomain = new URL(origin).hostname;
    
    if (!ALLOWED_DOMAINS.includes(originDomain)) {
      return new NextResponse(
        JSON.stringify({ status: 'error', message: 'Access denied' }),
        { status: 403 }
      );
    }

    // Weryfikacja Referer
    const referer = request.headers.get('referer') || '';
    if (!referer.startsWith(process.env.NEXTAUTH_URL)) {
      return new NextResponse(
        JSON.stringify({ status: 'error', message: 'Invalid request source' }),
        { status: 403 }
      );
    }

    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    
    if (ipRequests.has(clientIP)) {
      const record = ipRequests.get(clientIP);
      if (now - record.firstRequest < RATE_LIMIT.windowMs) {
        if (record.count >= RATE_LIMIT.max) {
          return new NextResponse(
            JSON.stringify({ status: 'error', message: 'Too many requests' }),
            { status: 429 }
          );
        }
        record.count++;
      } else {
        ipRequests.set(clientIP, { count: 1, firstRequest: now });
      }
    } else {
      ipRequests.set(clientIP, { count: 1, firstRequest: now });
    }

    // Przetwarzanie żądania
    const { url } = await request.json();
    
    const response = await axios.get('https://open.kakobuy.com/open/pic/qcImage', {
      params: { 
        token: process.env.KAKOBUY_TOKEN,
        goodsUrl: url 
      }
    });

    return new NextResponse(
      JSON.stringify({ 
        status: 'success', 
        data: response.data 
      }),
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Content-Security-Policy': "default-src 'self'",
          'X-Content-Type-Options': 'nosniff'
        }
      }
    );

  } catch (error) {
    return new NextResponse(
      JSON.stringify({ 
        status: 'error', 
        message: 'Internal server error' 
      }),
      { status: 500 }
    );
  }
}