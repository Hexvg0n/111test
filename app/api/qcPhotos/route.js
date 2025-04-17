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
    
    if (!body?.url) {
      return NextResponse.json({ 
        status: 'error', message: 'Goods URL is required' 
      }, { status: 400, headers: securityHeaders });
    }

    if (!KAKOBUY_TOKEN) {
      return NextResponse.json({ 
        status: 'error', message: 'Token is required' 
      }, { status: 500, headers: securityHeaders });
    }

    const encodedUrl = encodeURIComponent(body.url);

    // Attempt POST with JSON body (as per example in documentation)
    const response = await axios.post('https://open.kakobuy.com/open/pic/qcImage', {
      token: KAKOBUY_TOKEN,
      goodsUrl: encodedUrl
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36'
      },
      timeout: 15000
    });

    if (response.data.status === 'error') {
      return NextResponse.json(response.data, { status: 400, headers: securityHeaders });
    }

    const processedPhotos = processPhotos(response.data.data);
    const groups = Object.values(processedPhotos).sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json({ 
      status: 'success', 
      data: { groups } 
    }, { headers: securityHeaders });

  } catch (error) {
    console.error('API Error:', error);
    
    if (error?.response?.data?.message) {
      return NextResponse.json({
        status: 'error',
        message: error.response.data.message
      }, {
        status: error.response.status || 500,
        headers: securityHeaders
      });
    }

    return NextResponse.json({
      status: 'error',
      message: 'Internal server error'
    }, {
      status: 500,
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
