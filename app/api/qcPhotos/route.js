import { NextResponse } from 'next/server';
import axios from 'axios';

const KAKOBUY_TOKEN = process.env.KAKOBUY_TOKEN;

const securityHeaders = {
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
};

const processPhotos = (apiData) => {
  if (!Array.isArray(apiData)) return [];
  
  return apiData.reduce((acc, item) => {
    const imageUrl = item?.image_url?.trim();
    if (!imageUrl?.startsWith('https')) return acc;

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
  }, {});
};

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required parameters
    if (!body?.url) {
      return NextResponse.json(
        { status: 'error', message: 'Goods URL is required' },
        { status: 400, headers: securityHeaders }
      );
    }

    if (!KAKOBUY_TOKEN) {
      return NextResponse.json(
        { status: 'error', message: 'Token is required' },
        { status: 500, headers: securityHeaders }
      );
    }

    // Proper URL encoding and API request configuration
    const encodedUrl = encodeURIComponent(body.url);
    const response = await axios.get('https://open.kakobuy.com/open/pic/qcImage', {
      params: {
        token: KAKOBUY_TOKEN,
        goodsUrl: encodedUrl
      },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36'
      },
      timeout: 15000
    });

    // Handle API response
    if (response.data.status === 'error') {
      return NextResponse.json(
        { status: 'error', message: response.data.message },
        { status: 400, headers: securityHeaders }
      );
    }

    // Process response data
    if (!response.data?.data?.length) {
      return NextResponse.json(
        { status: 'error', message: 'No QC images found' },
        { status: 404, headers: securityHeaders }
      );
    }

    const processedPhotos = processPhotos(response.data.data);
    const groups = Object.values(processedPhotos).sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json(
      { 
        status: 'success', 
        data: { groups } 
      },
      { headers: securityHeaders }
    );

  } catch (error) {
    console.error('API Error:', error);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid token' },
        { status: 401, headers: securityHeaders }
      );
    }
    
    if (error.response?.status === 429) {
      return NextResponse.json(
        { status: 'error', message: 'Daily query limit exceeded' },
        { status: 429, headers: securityHeaders }
      );
    }

    // Handle other errors
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Internal server error';
    
    return NextResponse.json(
      { status: 'error', message },
      { status, headers: securityHeaders }
    );
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
