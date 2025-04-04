// app/api/converter/route.js
import { NextResponse } from 'next/server';

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

const platformNameToCode = {
  '1688': '0',
  'taobao': '1',
  'weidian': '2',
  'tmall': '3'
};

function extractItemID(url, patterns) {
  const decodedUrl = decodeURIComponent(url);
  for (const pattern of patterns) {
    const match = decodedUrl.match(pattern);
    if (match) {
      if (match.length > 2) { // Handle patterns with multiple capture groups
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
      // Ensure URL is a string and has a protocol
      if (typeof url !== 'string' || !url.startsWith('http')) {
        throw new Error('Invalid URL format');
      }
      const urlObj = new URL(url);
      const urlParam = urlObj.searchParams.get('url');
      return urlParam ? decodeURIComponent(urlParam) : url;
    } catch (error) {
      console.error('Invalid URL during decoding:', error.message);
      return url; // Return original URL on error
    }
  }
  return url;
}

function identifyPlatform(url) {
  for (const [name, platform] of Object.entries(platforms)) {
    if (platform.regex.test(url)) return name;
  }
  return null;
}

function convertMiddlemanToOriginal(url) {
  for (const [middlemanName, middleman] of Object.entries(middlemen)) {
    const aliases = [middlemanName, ...(middleman.aliases || [])];
    if (aliases.some(alias => url.includes(alias))) {
      const processedUrl = decodeUrlIfNeeded(url, middleman);
      const extracted = extractItemID(processedUrl, middleman.itemIDPattern);
      if (extracted) {
        let platformName = null;
        let itemID = "";

        if (middlemanName === 'hoobuy') {
          if (extracted.platformCode && extracted.itemID) {
            platformName = codeToPlatformName[extracted.platformCode];
            itemID = extracted.itemID;
          }
        } else if (middlemanName === 'cssbuy') {
          const cssPlatformMatch = processedUrl.match(/item-(taobao|1688|micro|tmall)-(\d+)\.html$/);
          if (cssPlatformMatch) {
            platformName = { taobao: 'taobao', '1688': '1688', micro: 'weidian', tmall: 'tmall' }[cssPlatformMatch[1]];
            itemID = cssPlatformMatch[2];
          }
        } else {
          for (const [platformKey, platformValue] of Object.entries(middleman.platformMapping)) {
            if (processedUrl.includes(platformValue)) {
              platformName = platformKey;
              break;
            }
          }
          itemID = extracted.itemID;
        }

        if (platformName && platforms[platformName]) {
          return platforms[platformName].urlPattern.replace("{{itemID}}", itemID);
        }
      }
    }
  }
  return null;
}

function convertUrlToMiddleman(originalUrl, middlemanKey) {
  const middleman = middlemen[middlemanKey];
  if (!middleman) return null;

  let url = originalUrl;
  
  // Dekoduj URL jeśli wymagane
  if (middleman.requiresDecoding) {
    try {
      const urlObj = new URL(originalUrl);
      url = decodeURIComponent(urlObj.searchParams.get('url') || originalUrl);
    } catch (error) {
      console.error('Błąd dekodowania URL:', error);
      return null;
    }
  }

  // Identyfikuj platformę źródłową
  const platformName = identifyPlatform(url);
  if (!platformName) return null;

  // Ekstrakcja ID produktu
  const extraction = extractItemID(url, middleman.itemIDPattern);
  if (!extraction?.itemID) return null;

  // Specjalna obsługa dla HooBuy
  if (middlemanKey === 'hoobuy') {
    const platformCode = platformNameToCode[platformName];
    if (!platformCode) return null;
    return middleman.template
      .replace('{{platformCode}}', platformCode)
      .replace('{{itemID}}', extraction.itemID);
  }

  // Generuj końcowy URL
  return middleman.template
    .replace('{{encodedUrl}}', encodeURIComponent(originalUrl))
    .replace('{{platformDomain}}', middleman.platformMapping[platformName] || '')
    .replace('{{cssPlatform}}', middleman.platformMapping[platformName] || '')
    .replace('{{itemID}}', extraction.itemID);
}

export async function POST(request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'Brak wymaganego parametru URL' }, { status: 400, headers });
    }

    let originalUrl = convertMiddlemanToOriginal(url);
    if (!originalUrl) {
      const platformName = identifyPlatform(url);
      if (platformName) {
        const extraction = extractItemID(url, platforms[platformName].itemIDPattern);
        if (extraction?.itemID) {
          originalUrl = platforms[platformName].urlPattern.replace("{{itemID}}", extraction.itemID);
        }
      }
    }

    const convertedUrls = { original: originalUrl || url };

    for (const middlemanKey of Object.keys(middlemen)) {
      const convertedUrl = convertUrlToMiddleman(url, middlemanKey);
      if (convertedUrl) {
        convertedUrls[middlemanKey] = convertedUrl;
      }
    }

    return NextResponse.json(convertedUrls, { headers });
  } catch (error) {
    console.error('Błąd API:', error);
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500, headers });
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}