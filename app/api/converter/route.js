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
    acbuy: {
    name: "ACBuy",
    template: "https://acbuy.com/product?id={{itemID}}&u=dripez&source={{platformIdentifier}}",
    platformMapping: {
      taobao: "TB",
      weidian: "WD",
      "1688": "AL"
    },
    itemIDPattern: [
      /id=(\d+)/,
      /\/offer\/(\d+)\.html/,
      /itemID=(\d+)/,
      /itemI[dD]=(\d+)/
    ],
    requiresDecoding: false,
    sourceCodeToPlatform: {
      "TB": "taobao",
      "WD": "weidian",
      "AL": "1688"
    }
  },
  kakobuy: {
    name: "Kakobuy",
    template: "https://www.kakobuy.com/item/details?url={{encodedUrl}}&affcode=dripez",
    platformMapping: {
      taobao: "item.taobao.com",
      "1688": "detail.1688.com",
      weidian: "weidian.com",
      tmall: "detail.tmall.com"
    },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/],
    requiresDecoding: true
  },
  superbuy: {
    name: "Superbuy",
    template: "https://www.superbuy.com/en/page/buy/?url={{encodedUrl}}&partnercode=EiE9aB",
    platformMapping: {
      taobao: "item.taobao.com",
      "1688": "detail.1688.com",
      weidian: "weidian.com",
      tmall: "detail.tmall.com"
    },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/],
    requiresDecoding: true
  },
  cssbuy: {
    name: "CSSBuy",
    template: "https://cssbuy.com/item{{cssPlatform}}{{itemID}}.html?promotionCode=90622f541f98cd81",
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
      /itemI[dD]=(\d+)/,
      /item-(taobao|1688|micro|tmall)-(\d+)\.html$/
    ],
    requiresDecoding: false
  },
  allchinabuy: {
    name: "AllChinaBuy",
    template: "https://www.allchinabuy.com/en/page/buy/?url={{encodedUrl}}&partnercode=wVK3gY",
    platformMapping: {
      taobao: "item.taobao.com",
      "1688": "detail.1688.com",
      weidian: "weidian.com",
      tmall: "detail.tmall.com"
    },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/],
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
    itemIDPattern: [/agent\/(taobao|tmall|1688|weidian)\/(\d+)\.html/, /id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/],
    requiresDecoding: false
  },
  lovegobuy: {
    name: "LoveGoBuy",
    template: "https://www.lovegobuy.com/product?id={{itemID}}&shop_type={{platformDomain}}",
    platformMapping: {
      taobao: "taobao",
      "1688": "1688",
      weidian: "weidian",
      tmall: "tmall"
    },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/],
    requiresDecoding: false
  },
  cnfans: {
    name: "CNFans",
    template: "https://cnfans.com/product/?shop_type={{platformDomain}}&id={{itemID}}&ref=191373",
    platformMapping: {
      taobao: "taobao",
      "1688": "ali_1688",
      weidian: "weidian",
      tmall: "tmall"
    },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/],
    requiresDecoding: false
  },
  joyabuy: {
    name: "Joyabuy",
    template: "https://joyabuy.com/product/?shop_type={{platformDomain}}&id={{itemID}}&ref=300312245",
    platformMapping: {
      taobao: "taobao",
      "1688": "ali_1688",
      weidian: "weidian",
      tmall: "tmall"
    },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/],
    requiresDecoding: false
  },
  mulebuy: {
    name: "Mulebuy",
    template: "https://mulebuy.com/product/?shop_type={{platformDomain}}&id={{itemID}}&ref=200345641",
    platformMapping: {
      taobao: "taobao",
      "1688": "ali_1688",
      weidian: "weidian",
      tmall: "tmall"
    },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/],
    requiresDecoding: false
  },
  hoobuy: {
    name: "HooBuy",
    template: "https://hoobuy.com/product/{{platformCode}}/{{itemID}}?inviteCode=w8ow9ZB8",
    platformMapping: {
      '0': 'detail.1688.com',
      '1': 'item.taobao.com',
      '2': 'weidian.com',
      '3': 'detail.tmall.com'
    },
    itemIDPattern: [/product\/(\d+)\/(\d+)/, /id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/],
    requiresDecoding: false
  },
};

const platformNameToCode = {
  '1688': '0',
  'taobao': '1',
  'weidian': '2',
  'tmall': '3'
};

const codeToPlatformName = {
  '0': '1688',
  '1': 'taobao',
  '2': 'weidian',
  '3': 'tmall'
};

function extractItemID(url, patterns) {
  const decodedUrl = decodeURIComponent(url);
  for (const pattern of patterns) {
    const match = decodedUrl.match(pattern);
    if (match) {
      if (match.length > 2 && pattern.source.includes('(') && pattern.source.indexOf('(') < pattern.source.lastIndexOf('(') ) {
        if (pattern.source.includes('item-(taobao|1688|micro|tmall)-') || pattern.source.includes('agent\\/(taobao|tmall|1688|weidian)\\/')) {
             return { platformCode: match[1], itemID: match[2] };
        } else if (pattern.source.includes('product\\/(\\d+)\\/(\\d+)')) {
             return { platformCode: match[1], itemID: match[2] };
        }
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
      if (typeof url !== 'string' || !url.startsWith('http')) {
        const decodedAttempt = decodeURIComponent(url);
        if (decodedAttempt.startsWith('http')) return decodedAttempt;
      }
      const urlObj = new URL(url);
      const urlParam = urlObj.searchParams.get('url');
      return urlParam ? decodeURIComponent(urlParam) : url;
    } catch (error) {
      if (typeof url === 'string') {
        try {
            const decodedFallback = decodeURIComponent(url);
            if (decodedFallback.startsWith('http') || Object.keys(platforms).some(p => decodedFallback.includes(p))) {
                return decodedFallback;
            }
        } catch (e2) {}
      }
      return url;
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
    if (aliases.some(alias => url.toLowerCase().includes(alias.toLowerCase()))) {
      const processedUrl = decodeUrlIfNeeded(url, middleman);
      const extracted = extractItemID(processedUrl, middleman.itemIDPattern);
      if (extracted) {
        let platformName = null;
        let itemID = null;
        if (extracted.itemID) itemID = extracted.itemID;
        if (middlemanName === 'hoobuy') {
          if (extracted.platformCode && extracted.itemID) {
            platformName = codeToPlatformName[extracted.platformCode];
            itemID = extracted.itemID;
          }
        } else if (middlemanName === 'cssbuy') {
          if (extracted.platformCode && extracted.itemID) {
             const cssPlatformToStandard = { taobao: 'taobao', '1688': '1688', micro: 'weidian', tmall: 'tmall' };
             platformName = cssPlatformToStandard[extracted.platformCode];
             itemID = extracted.itemID;
          }
        } else if (middlemanName === 'basetao') {
             if (extracted.platformCode && extracted.itemID) {
                 platformName = extracted.platformCode;
                 itemID = extracted.itemID;
             }
        } else if (middlemanName === 'acbuy' && middleman.sourceCodeToPlatform) {
            if (itemID) {
                const sourceMatch = processedUrl.match(/[?&]source=([^&]+)/);
                if (sourceMatch && sourceMatch[1]) {
                    const sourceCode = sourceMatch[1];
                    platformName = middleman.sourceCodeToPlatform[sourceCode];
                }
            }
        } else {
          if (itemID) {
            if (middleman.platformMapping && typeof middleman.platformMapping === 'object') {
              for (const [platformKey, platformValueInMap] of Object.entries(middleman.platformMapping)) {
                if (processedUrl.includes(platformValueInMap) && platforms[platformKey]) {
                  platformName = platformKey;
                  break;
                }
              }
            }
            if (!platformName && middleman.requiresDecoding) {
              platformName = identifyPlatform(processedUrl);
            }
          }
        }

        if (platformName && itemID && platforms[platformName]) {
          return platforms[platformName].urlPattern.replace("{{itemID}}", itemID);
        }
      }
    }
  }
  return null;
}

function convertUrlToMiddleman(originalUrlInput, middlemanKey) {
  const middleman = middlemen[middlemanKey];
  if (!middleman) return null;

  let urlToParse = decodeUrlIfNeeded(originalUrlInput, middleman);
  const platformName = identifyPlatform(urlToParse);
  let extraction;
  if (platformName && platforms[platformName]) {
      extraction = extractItemID(urlToParse, platforms[platformName].itemIDPattern);
  } else {
      extraction = extractItemID(urlToParse, middleman.itemIDPattern);
  }

  if (!extraction?.itemID) return null;
  if (!platformName && (middleman.template.includes("{{platform") || middlemanKey === 'hoobuy')) {
      return null;
  }
  if (middlemanKey === 'hoobuy') {
    if (!platformName) return null;
    const platformCode = platformNameToCode[platformName];
    if (!platformCode) return null;
    return middleman.template
      .replace('{{platformCode}}', platformCode)
      .replace('{{itemID}}', extraction.itemID);
  }

  const platformMappedValue = platformName ? (middleman.platformMapping ? middleman.platformMapping[platformName] : undefined) : undefined;
  if (!platformMappedValue && platformName && (middleman.template.includes('{{platform'))) {
      return null;
  }
  
  let resultUrl = middleman.template.replace(new RegExp('{{itemID}}', 'g'), extraction.itemID);
  if (resultUrl.includes('{{encodedUrl}}')) {
    resultUrl = resultUrl.replace(new RegExp('{{encodedUrl}}', 'g'), encodeURIComponent(originalUrlInput));
  }
  if (platformMappedValue) {
    resultUrl = resultUrl.replace(new RegExp('{{platformDomain}}', 'g'), platformMappedValue);
    resultUrl = resultUrl.replace(new RegExp('{{cssPlatform}}', 'g'), platformMappedValue);
    resultUrl = resultUrl.replace(new RegExp('{{platformIdentifier}}', 'g'), platformMappedValue);
  } else if (platformName && !platformMappedValue && (middleman.template.includes('{{platform'))) {
        return null;
  }
  if (resultUrl.includes("{{") && resultUrl.includes("}}")) {
      if (!platformName && (resultUrl.includes("{{platform"))) return null;
  }
  return resultUrl;
}

// ====================================================================
// NOWY ENDPOINT GET - DO POBIERANIA LISTY AGENTÓW
// ====================================================================
export async function GET() {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const agents = Object.entries(middlemen).map(([key, value]) => ({
      key: key,
      name: value.name
    }));

    return NextResponse.json({ agents }, { headers });
  } catch (error) {
    console.error('Błąd API GET:', error);
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500, headers });
  }
}

// ====================================================================
// ZAKTUALIZOWANY ENDPOINT POST - DLA LEPSZEJ OBSŁUGI NA STRONIE
// ====================================================================
export async function POST(request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'Brak wymaganego parametru URL' }, { status: 400, headers });
    }

    let originalProductUrl = convertMiddlemanToOriginal(url);
    if (!originalProductUrl) {
      const identifiedPlatform = identifyPlatform(url);
      if (identifiedPlatform) {
        const extractionResult = extractItemID(url, platforms[identifiedPlatform].itemIDPattern);
        if (extractionResult?.itemID) {
          originalProductUrl = platforms[identifiedPlatform].urlPattern.replace("{{itemID}}", extractionResult.itemID);
        }
      }
    }

    const convertedLinks = [];
    const baseLinkForMiddlemen = originalProductUrl || url;

    for (const [middlemanKey, middlemanValue] of Object.entries(middlemen)) {
      const convertedUrl = convertUrlToMiddleman(baseLinkForMiddlemen, middlemanKey);
      if (convertedUrl) {
        convertedLinks.push({
          key: middlemanKey,
          name: middlemanValue.name,
          url: convertedUrl
        });
      }
    }

    const responsePayload = {
      originalUrl: originalProductUrl || "Nie udało się zidentyfikować oryginalnego linku.",
      convertedLinks: convertedLinks
    };

    return NextResponse.json(responsePayload, { headers });
  } catch (error) {
    console.error('Błąd API POST:', error);
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera', details: error.message }, { status: 500, headers });
  }
}

// ====================================================================
// ENDPOINT OPTIONS - DLA OBSŁUGI CORS
// ====================================================================
export async function OPTIONS() {
  return NextResponse.json(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}