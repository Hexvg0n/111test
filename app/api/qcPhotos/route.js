import { NextResponse } from 'next/server';
import axios from 'axios';

const KAKOBUY_TOKEN = process.env.KAKOBUY_TOKEN;
const API_SECRET = process.env.API_SECRET;


const securityHeaders = {
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
};

const processPhotos = (apiData) => {
  return apiData.data.reduce((acc, item) => {
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
    // Authentication and validation
   

    const body = await request.json();
    if (!body?.url) {
      return NextResponse.json(
        { error: 'Missing URL parameter' },
        { status: 400 }
      );
    }

    // Proper URL encoding and API request configuration
    const encodedUrl = encodeURIComponent(body.url);
    const response = await axios.get('https://open.kakobuy.com/open/pic/qcImage', {
      params: {
        token: KAKOBUY_TOKEN,
        goodsUrl: encodedUrl // Use encoded URL
      },
      headers: {
        'Referer': 'https://www.kakobuy.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36'
      },
      timeout: 15000
    });

    // Process response data
    if (!response.data?.data?.length) {
      return NextResponse.json(
        { error: 'No QC photos found' },
        { status: 404 }
      );
    }

    const groups = processGroups(response.data.data);
    return NextResponse.json({ status: 'success', data: { groups } });

  } catch (error) {
    console.error('API Error:', error);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}

function processGroups(items) {
  return items.reduce((groups, item) => {
    const date = item.qc_date?.split(' ')[0] || 'no-date';
    const existing = groups.find(g => g.variant.includes(date));
    
    if (item.image_url?.startsWith('https')) {
      if (!existing) {
        groups.push({
          variant: `QC ${date}`,
          photos: [item.image_url],
          timestamp: new Date(date).getTime()
        });
      } else {
        existing.photos.push(item.image_url);
      }
    }
    return groups;
  }, []).sort((a, b) => b.timestamp - a.timestamp);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key'
    }
  });
}
export async function OPTIONS() {
  return new NextResponse(null, { headers: securityHeaders });
}