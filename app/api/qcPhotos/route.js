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
  const origin = request.headers.get('origin') || '';
  const clientIP = request.headers.get('x-forwarded-for') || 'unknown';





  try {
    const body = await request.json();
    if (!body?.url) {
      return NextResponse.json(
        { error: 'Missing URL parameter' },
        { status: 400, headers: securityHeaders }
      );
    }

    const response = await axios.get('https://open.kakobuy.com/open/pic/qcImage', {
      params: { token: KAKOBUY_TOKEN, goodsUrl: body.url },
      timeout: 15000
    });

    const groupedData = Object.values(processPhotos(response.data))
      .sort((a, b) => b.timestamp - a.timestamp);

    if (!groupedData.length) {
      return NextResponse.json(
        { error: 'No QC photos found' },
        { status: 404, headers: securityHeaders }
      );
    }

    return NextResponse.json(
      { status: 'success', data: { groups: groupedData } },
      { headers: securityHeaders }
    );

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: securityHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: securityHeaders });
}