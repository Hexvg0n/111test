import { NextResponse } from 'next/server';
import axios from 'axios';

const KAKOBUY_TOKEN = process.env.KAKOBUY_TOKEN;
const API_TIMEOUT = 15000;
const RATE_LIMIT = 100;
const ipRequestCounts = new Map();

// Struktury do konwersji URL
const platforms = {
  taobao: {
    regex: /(?:https?:\/\/)?(?:\w+\.)?taobao\.com/,
    urlPattern: "https://item.taobao.com/item.htm?id={{itemID}}",
    itemIDPattern: [/id=(\d+)/]
  },
  tmall: {
    regex: /(?:https?:\/\/)?(?:www\.)?detail\.tmall\.com/,
    urlPattern: "https://detail.tmall.com/item.htm?id={{itemID}}",
    itemIDPattern: [/id=(\d+)/]
  },
  "1688": {
    regex: /(?:https?:\/\/)?(?:\w+\.)?1688\.com/,
    urlPattern: "https://detail.1688.com/offer/{{itemID}}.html",
    itemIDPattern: [/\/offer\/(\d+)\.html/]
  },
  weidian: {
    regex: /(?:https?:\/\/)?(?:www\.)?weidian\.com/,
    urlPattern: "https://weidian.com/item.html?itemID={{itemID}}",
    itemIDPattern: [/itemID=(\d+)/, /itemI[dD]=(\d+)/]
  },
};

const middlemen = {
  kakobuy: {
    name: "Kakobuy",
    template: "https://www.kakobuy.com/item/details?url={{encodedUrl}}&affcode=frosireps",
    platformMapping: {
      taobao: "item.taobao.com",
      "1688": "detail.1688.com",
      weidian: "weidian.com",
      tmall: "detail.tmall.com"
    },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/],
    requiresDecoding: true
  },
  superbuy: {
    name: "Superbuy",
    template: "https://www.superbuy.com/en/page/buy/?url={{encodedUrl}}&partnercode=EEr5wI",
    platformMapping: {
      taobao: "item.taobao.com",
      "1688": "detail.1688.com",
      weidian: "weidian.com",
      tmall: "detail.tmall.com"
    },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/],
    requiresDecoding: true
  },
  cssbuy: {
    name: "CSSBuy",
    template: "https://cssbuy.com/item{{cssPlatform}}{{itemID}}.html",
    platformMapping: {
      taobao: "-taobao-",
      "1688": "-1688-",
      weidian: "-micro-",
      tmall: "-tmall-"
    },
    itemIDPattern: [
      /id=(\d+)/,
      /\/offer\/(\d+)\.html/,
      /itemID=(\d+)/,
      /item-(taobao|1688|micro|tmall)-(\d+)\.html$/
    ],
    requiresDecoding: false
  },
  allchinabuy: {
    name: "AllChinaBuy",
    template: "https://www.allchinabuy.com/en/page/buy/?url={{encodedUrl}}&partnercode=wf5ZpA",
    platformMapping: {
      taobao: "item.taobao.com",
      "1688": "detail.1688.com",
      weidian: "weidian.com",
      tmall: "detail.tmall.com"
    },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/],
    requiresDecoding: true
  },
  basetao: {
    name: "Basetao",
    template: "https://www.basetao.com/products/agent/{{platformDomain}}/{{itemID}}.html",
    platformMapping: {
      taobao: "taobao",
      tmall: "tmall",
      "1688": "1688",
      weidian: "weidian"
    },
    itemIDPattern: [/agent\/(taobao|tmall|1688|weidian)\/(\d+)\.html/, /itemID=(\d+)/],
    requiresDecoding: false
  },
  lovegobuy: {
    name: "LoveGoBuy",
    template: "https://www.lovegobuy.com/product?id={{itemID}}&shop_type={{platformDomain}}",
    platformMapping: {
      taobao: "taobao",
      "1688": "1688",
      weidian: "weidian"
    },
    itemIDPattern: [/id=(\d+)/, /itemID=(\d+)/],
    requiresDecoding: false
  },
  cnfans: {
    name: "CNFans",
    template: "https://cnfans.com/product/?shop_type={{platformDomain}}&id={{itemID}}",
    platformMapping: {
      taobao: "taobao",
      "1688": "ali_1688",
      weidian: "weidian"
    },
    itemIDPattern: [/id=(\d+)/, /itemID=(\d+)/],
    requiresDecoding: false
  },
  joyabuy: {
    name: "Joyabuy",
    template: "https://joyabuy.com/product/?shop_type={{platformDomain}}&id={{itemID}}",
    platformMapping: {
      taobao: "taobao",
      "1688": "ali_1688",
      weidian: "weidian"
    },
    itemIDPattern: [/id=(\d+)/, /itemID=(\d+)/],
    requiresDecoding: false
  },
  mulebuy: {
    name: "Mulebuy",
    template: "https://mulebuy.com/product/?shop_type={{platformDomain}}&id={{itemID}}",
    platformMapping: {
      taobao: "taobao",
      "1688": "ali_1688",
      weidian: "weidian"
    },
    itemIDPattern: [/id=(\d+)/, /itemID=(\d+)/],
    requiresDecoding: false
  },
  hoobuy: {
    name: "HooBuy",
    template: "https://hoobuy.com/product/{{platformCode}}/{{itemID}}",
    platformMapping: {
      '0': 'detail.1688.com',
      '1': 'item.taobao.com',
      '2': 'weidian.com',
      '3': 'detail.tmall.com'
    },
    itemIDPattern: [/product\/(\d+)\/(\d+)/],
    requiresDecoding: false
  }
};

// Funkcje pomocnicze
function identifyPlatform(url) {
  for (const [name, platform] of Object.entries(platforms)) {
    if (platform.regex.test(url)) return name;
  }
  return null;
}

function extractItemID(url, patterns) {
  const decodedUrl = decodeURIComponent(url);
  for (const pattern of patterns) {
    const match = decodedUrl.match(pattern);
    if (match) {
      if (match.length > 2) {
        return { platformCode: match[1], itemID: match[2] };
      }
      return { itemID: match[1] };
    }
  }
  return null;
}

function decodeUrlIfNeeded(url, middleman) {
  if (middleman.requiresDecoding) {
    try {
      const urlObj = new URL(url);
      const urlParam = urlObj.searchParams.get('url');
      return urlParam ? decodeURIComponent(urlParam) : url;
    } catch {
      return url;
    }
  }
  return url;
}

function convertMiddlemanToOriginal(url) {
  for (const [middlemanName, middleman] of Object.entries(middlemen)) {
    if (url.includes(middlemanName)) {
      const processedUrl = decodeUrlIfNeeded(url, middleman);
      const extracted = extractItemID(processedUrl, middleman.itemIDPattern);
      
      if (extracted?.itemID) {
        for (const [platformKey, platformValue] of Object.entries(middleman.platformMapping)) {
          if (processedUrl.includes(platformValue)) {
            return platforms[platformKey].urlPattern.replace("{{itemID}}", extracted.itemID);
          }
        }
      }
    }
  }
  return url;
}

// Wzorce URL
const URL_PATTERNS = [
  /^https?:\/\/(item\.taobao|detail\.tmall)\.com\/item\.htm\?.*id=\d+/i,
  /^https?:\/\/weidian\.com\/item\.html\?.*itemID=\d+/i,
  /^https?:\/\/detail\.1688\.com\/offer\/\d+\.html/i
];

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
      return NextResponse.json(
        { error: errors.rate_limit },
        { status: 429, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }
    ipRequestCounts.set(clientIP, requestCount + 1);

    // Parsuj i waliduj żądanie
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: errors.invalid_json },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    if (!body?.url) {
      return NextResponse.json(
        { error: errors.missing_url },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Konwertuj URL pośrednika
    let targetUrl = convertMiddlemanToOriginal(body.url);
    
    // Waliduj przekonwertowany URL
    if (!URL_PATTERNS.some(pattern => pattern.test(targetUrl))) {
      return NextResponse.json(
        { error: errors.invalid_url },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Wywołaj API Kakobuy
    const response = await axios.get('https://open.kakobuy.com/open/pic/qcImage', {
      params: {
        token: KAKOBUY_TOKEN,
        goodsUrl: targetUrl
      },
      timeout: API_TIMEOUT,
      responseType: 'json'
    });

    // Przetwórz odpowiedź
    const items = response.data?.data?.filter(item => 
      item?.image_url?.startsWith('https://')
    ) || [];

    return NextResponse.json(
      { 
        status: 'success',
        data: {
          groups: [{
            variant: "QC Photos",
            photos: items.map(item => item.image_url)
          }]
        }
      },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: {
          code: 'SERVER_ERROR',
          message: 'Wewnętrzny błąd serwera',
          details: error.message
        }
      },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
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