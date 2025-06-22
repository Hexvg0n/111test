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
      tmall: "tmall" // Dodano tmall dla spójności, jeśli obsługują
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
      tmall: "tmall" // Dodano tmall dla spójności, jeśli obsługują
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
      tmall: "tmall" // Dodano tmall dla spójności, jeśli obsługują
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
      tmall: "tmall" // Dodano tmall dla spójności, jeśli obsługują
    },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/],
    requiresDecoding: false
  },
  hoobuy: {
    name: "HooBuy",
    template: "https://hoobuy.com/product/{{platformCode}}/{{itemID}}?inviteCode=w8ow9ZB8",
    platformMapping: { // To mapowanie jest używane inaczej przez HooBuy (z platformCode)
      '0': 'detail.1688.com',
      '1': 'item.taobao.com',
      '2': 'weidian.com',
      '3': 'detail.tmall.com'
    },
    itemIDPattern: [/product\/(\d+)\/(\d+)/, /id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/],
    requiresDecoding: false
  },
  // NOWY AGENT: ACBUY
  acbuy: {
    name: "ACBuy",
    template: "https://acbuy.com/product?id={{itemID}}&u=dripez&source={{platformIdentifier}}",
    platformMapping: { // Używane w convertUrlToMiddleman do wypełnienia {{platformIdentifier}}
      taobao: "TB",
      weidian: "WD",
      "1688": "AL"
      // Tmall nie jest zdefiniowany, więc konwersja dla Tmall do ACBuy zwróci null, co jest poprawne
    },
    itemIDPattern: [ // Używane w obu kierunkach konwersji. Musi objąć formaty ID platform i format ID w linku ACBuy.
      /id=(\d+)/,             // Dla Taobao, Tmall, Weidian (jako parametr), ACBuy (parametr)
      /\/offer\/(\d+)\.html/, // Dla 1688
      /itemID=(\d+)/,          // Dla Weidian (parametr)
      /itemI[dD]=(\d+)/       // Dla Weidian (parametr, z uwzględnieniem wielkości liter)
    ],
    requiresDecoding: false,
    sourceCodeToPlatform: { // Używane w convertMiddlemanToOriginal do mapowania kodu 'source' na nazwę platformy
      "TB": "taobao",
      "WD": "weidian",
      "AL": "1688"
    }
  }
};

const platformNameToCode = {
  '1688': '0',
  'taobao': '1',
  'weidian': '2',
  'tmall': '3'
};

// DODANO: Mapowanie kodu na nazwę platformy, potrzebne dla HooBuy w convertMiddlemanToOriginal
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
      if (match.length > 2 && pattern.source.includes('(') && pattern.source.indexOf('(') < pattern.source.lastIndexOf('(') ) { // Lepsze sprawdzenie dla wielu grup
        // Jeśli wzorzec ma co najmniej dwie grupy przechwytujące, zakładamy format { platformCode: match[1], itemID: match[2] }
        // np. dla hoobuy /product/(platformCode)/(itemID)/ lub cssbuy /item-(platform)-(itemID).html
        // To sprawdzenie można ulepszyć, jeśli wzorce staną się bardziej złożone.
        // Na razie zakładamy, że jeśli są dwie grupy, to pierwsza jest kodem/identyfikatorem platformy, a druga itemID.
        if (pattern.source.includes('item-(taobao|1688|micro|tmall)-') || pattern.source.includes('agent\\/(taobao|tmall|1688|weidian)\\/')) {
             return { platformCode: match[1], itemID: match[2] }; // Dla CSSBuy i Basetao
        } else if (pattern.source.includes('product\\/(\\d+)\\/(\\d+)')) {
             return { platformCode: match[1], itemID: match[2] }; // Dla HooBuy
        }
        // Dla innych wzorców z wieloma grupami, które mogą nie być platformCode/itemID,
        // np. jeśli wzorzec przypadkowo przechwyci coś innego.
        // Bezpieczniej jest zwrócić tylko itemID, jeśli nie jesteśmy pewni struktury.
        // Jednak obecne wzorce z wieloma grupami są specyficzne.
        return { platformCode: match[1], itemID: match[2] }; // Domyślne zachowanie dla >2 grup
      }
      return { itemID: match[1] }; // Domyślnie pierwsza grupa to itemID
    }
  }
  return null;
}

function decodeUrlIfNeeded(url, middleman) {
  if (middleman.requiresDecoding) {
    try {
      if (typeof url !== 'string' || !url.startsWith('http')) {
        // Spróbuj zdekodować, nawet jeśli nie jest to pełny URL, może to być tylko parametr
        const decodedAttempt = decodeURIComponent(url);
        if (decodedAttempt.startsWith('http')) return decodedAttempt; // Jeśli po dekodowaniu jest to URL
        // Jeśli nie, kontynuuj próbę parsowania jako URL w poszukiwaniu parametru 'url'
      }
      const urlObj = new URL(url);
      const urlParam = urlObj.searchParams.get('url');
      return urlParam ? decodeURIComponent(urlParam) : url;
    } catch (error) {
      // Jeśli parsowanie jako URL zawiedzie, ale jest to string, spróbuj prostego dekodowania
      if (typeof url === 'string') {
        try {
            const decodedFallback = decodeURIComponent(url);
            // Sprawdź, czy zdekodowany URL jest prawdopodobny (np. zaczyna się od http)
            // lub zawiera typowe fragmenty linków platform
            if (decodedFallback.startsWith('http') || plataformas.some(p => decodedFallback.includes(p))) {
                return decodedFallback;
            }
        } catch (e2) {
            // Ignoruj błąd fallbacku dekodowania
        }
      }
      console.error('Invalid URL or error during decoding:', error.message, "URL:", url);
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
    if (aliases.some(alias => url.toLowerCase().includes(alias.toLowerCase()))) { // Sprawdzanie case-insensitive
      const processedUrl = decodeUrlIfNeeded(url, middleman);
      const extracted = extractItemID(processedUrl, middleman.itemIDPattern);

      if (extracted) {
        let platformName = null;
        let itemID = null;

        // Logika przypisania itemID i potencjalnie platformCode
        if (extracted.itemID) itemID = extracted.itemID;


        if (middlemanName === 'hoobuy') {
          if (extracted.platformCode && extracted.itemID) {
            platformName = codeToPlatformName[extracted.platformCode]; // Użycie dodanej mapy
            itemID = extracted.itemID;
          }
        } else if (middlemanName === 'cssbuy') {
          // Dla CSSBuy, extractItemID z odpowiednim wzorcem powinien zwrócić platformCode i itemID
          if (extracted.platformCode && extracted.itemID) {
             const cssPlatformToStandard = { taobao: 'taobao', '1688': '1688', micro: 'weidian', tmall: 'tmall' };
             platformName = cssPlatformToStandard[extracted.platformCode];
             itemID = extracted.itemID;
          }
        } else if (middlemanName === 'basetao') {
             if (extracted.platformCode && extracted.itemID) {
                 platformName = extracted.platformCode; // platformCode to tutaj bezpośrednio nazwa platformy
                 itemID = extracted.itemID;
             }
        } else if (middlemanName === 'acbuy' && middleman.sourceCodeToPlatform) { // NOWA LOGIKA DLA ACBUY
            if (itemID) { // itemID powinno być już wyekstrahowane
                const sourceMatch = processedUrl.match(/[?&]source=([^&]+)/);
                if (sourceMatch && sourceMatch[1]) {
                    const sourceCode = sourceMatch[1];
                    platformName = middleman.sourceCodeToPlatform[sourceCode];
                }
            }
        } else {
          // Ogólna logika dla innych pośredników
          if (itemID) { // Jeśli itemID zostało wyekstrahowane
            // Próba identyfikacji platformy na podstawie platformMapping lub zdekodowanego URL
            if (middleman.platformMapping && typeof middleman.platformMapping === 'object') {
              for (const [platformKey, platformValueInMap] of Object.entries(middleman.platformMapping)) {
                if (processedUrl.includes(platformValueInMap) && platforms[platformKey]) {
                  platformName = platformKey;
                  break;
                }
              }
            }
            if (!platformName && middleman.requiresDecoding) {
              // Jeśli to był zakodowany URL, processedUrl powinien być oryginalnym linkiem
              platformName = identifyPlatform(processedUrl);
            } else if (!platformName && !middleman.requiresDecoding) {
                // Jeśli nie wymaga dekodowania, a URL nie zawierał informacji o platformie w mapowaniu
                // np. dla agentów, którzy mają ID w ścieżce, ale nie platformę
                // Można by spróbować zidentyfikować platformę, jeśli `processedUrl` jest oryginalnym linkiem
                // (co jest mniej prawdopodobne, jeśli `requiresDecoding` jest false)
                // Na tym etapie, jeśli platforma nie jest znana, może być trudno ją ustalić.
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

  // Url przekazany do tej funkcji to często oryginalny url wejściowy,
  // który może być już linkiem pośrednika lub oryginalnym linkiem platformy.
  // Dekodowanie tutaj jest bardziej dla przypadków, gdyby jakiś pośrednik kodował URL w nietypowy sposób,
  // a ta funkcja była wywoływana z takim URL-em.
  // Zazwyczaj `originalUrlInput` jest albo czystym linkiem platformy, albo linkiem innego pośrednika.
  let urlToParse = decodeUrlIfNeeded(originalUrlInput, middleman); // Dekoduj, jeśli middleman tego wymaga (rzadkie w tym kontekście)

  const platformName = identifyPlatform(urlToParse); // Identyfikuj platformę z (potencjalnie zdekodowanego) URL
  
  // Ekstrakcja ID produktu z urlToParse. Używamy wzorców platformy, jeśli jest znana,
  // w przeciwnym razie próbujemy ogólnych wzorców z middleman.itemIDPattern.
  let extraction;
  if (platformName && platforms[platformName]) {
      extraction = extractItemID(urlToParse, platforms[platformName].itemIDPattern);
  } else {
      // Jeśli platforma nie została zidentyfikowana (np. urlToParse to link pośrednika),
      // spróbuj wyciągnąć ID używając wzorców danego pośrednika, które są zwykle bardziej ogólne.
      extraction = extractItemID(urlToParse, middleman.itemIDPattern);
  }

  if (!extraction?.itemID) return null;

  // Jeśli platformName nadal nie jest znane (bo urlToParse nie był oryginalnym linkiem),
  // a szablon pośrednika wymaga informacji o platformie (np. ACBuy, HooBuy), to konwersja może się nie udać.
  if (!platformName &&
      (middleman.template.includes("{{platformDomain}}") ||
       middleman.template.includes("{{cssPlatform}}") ||
       middleman.template.includes("{{platformIdentifier}}") ||
       middlemanKey === 'hoobuy') // HooBuy potrzebuje platformCode, który pochodzi z platformName
     ) {
      // Nie można ustalić platformy źródłowej, a jest ona wymagana przez szablon pośrednika.
      return null;
  }


  if (middlemanKey === 'hoobuy') {
    if (!platformName) return null; // HooBuy wymaga platformName do uzyskania platformCode
    const platformCode = platformNameToCode[platformName];
    if (!platformCode) return null; // Nieznany kod platformy dla HooBuy
    return middleman.template
      .replace('{{platformCode}}', platformCode)
      .replace('{{itemID}}', extraction.itemID);
  }

  // Sprawdzenie, czy mapowanie platformy jest dostępne, jeśli jest wymagane przez szablon
  const platformMappedValue = platformName ? (middleman.platformMapping ? middleman.platformMapping[platformName] : undefined) : undefined;

  if (!platformMappedValue &&
      platformName && // Tylko jeśli platformName jest znane, ale nie ma dla niego mapowania
      (middleman.template.includes('{{platformDomain}}') ||
       middleman.template.includes('{{cssPlatform}}') ||
       middleman.template.includes('{{platformIdentifier}}'))
     ) {
      // Platforma jest znana, ale pośrednik jej nie mapuje (np. ACBuy nie mapuje Tmall)
      return null;
  }
  
  let resultUrl = middleman.template
    .replace(new RegExp('{{itemID}}', 'g'), extraction.itemID); // Zastąp wszystkie {{itemID}}

  if (resultUrl.includes('{{encodedUrl}}')) {
    // originalUrlInput to oryginalny URL przekazany do funkcji (przed jakimkolwiek dekodowaniem w tej funkcji)
    resultUrl = resultUrl.replace(new RegExp('{{encodedUrl}}', 'g'), encodeURIComponent(originalUrlInput));
  }

  if (platformMappedValue) {
    resultUrl = resultUrl.replace(new RegExp('{{platformDomain}}', 'g'), platformMappedValue);
    resultUrl = resultUrl.replace(new RegExp('{{cssPlatform}}', 'g'), platformMappedValue);
    resultUrl = resultUrl.replace(new RegExp('{{platformIdentifier}}', 'g'), platformMappedValue);
  } else if (platformName && !platformMappedValue &&
             (middleman.template.includes('{{platformDomain}}') ||
              middleman.template.includes('{{cssPlatform}}') ||
              middleman.template.includes('{{platformIdentifier}}'))) {
        // Jeśli mapowanie było wymagane, ale go nie było, powinniśmy byli już zwrócić null.
        // To jest dodatkowe zabezpieczenie, ale wcześniejsza logika powinna to obsłużyć.
        return null;
  }


  // Jeśli po wszystkich zamianach pozostały jakieś niechciane placeholdery, to jest problem
  if (resultUrl.includes("{{") && resultUrl.includes("}}")) {
      // To może oznaczać, że `platformName` było null, a szablon zawierał placeholder platformy,
      // który nie został obsłużony przez powyższą logikę (np. `platformMappedValue` było undefined).
      // Lub `extraction.itemID` był null/pusty.
      console.warn(`URL ${middlemanKey} może zawierać niezastąpione placeholdery: ${resultUrl}`);
      // Zdecyduj, czy zwrócić null, czy taki częściowo wypełniony URL. Bezpieczniej null.
      if (!platformName && (resultUrl.includes("{{platform") || resultUrl.includes("{{cssPlatform}}") || resultUrl.includes("{{platformIdentifier}}"))) return null;

  }

  return resultUrl;
}

export async function POST(request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Dodano Authorization na wszelki wypadek
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

    const convertedUrls = { original: originalProductUrl || url };

    // Jeśli mamy `originalProductUrl`, używamy go do konwersji na linki pośredników.
    // Jeśli nie, próbujemy z wejściowym `url` - niektóre konwersje mogą się nie udać.
    const baseLinkForMiddlemen = originalProductUrl || url;

    for (const middlemanKey of Object.keys(middlemen)) {
      // Przekazujemy `baseLinkForMiddlemen` do konwersji.
      // Jeśli `baseLinkForMiddlemen` jest linkiem innego pośrednika, `convertUrlToMiddleman`
      // spróbuje go zinterpretować. Jeśli jest to oryginalny link, zadziała najlepiej.
      const convertedUrl = convertUrlToMiddleman(baseLinkForMiddlemen, middlemanKey);
      if (convertedUrl) {
        convertedUrls[middlemanKey] = convertedUrl;
      }
    }

    return NextResponse.json(convertedUrls, { headers });
  } catch (error) {
    console.error('Błąd API:', error, error.stack);
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera', details: error.message }, { status: 500, headers });
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT', // Dodano więcej metod dla ogólności
      'Access-Control-Allow-Headers': 'Content-Type, Authorization' // Spójne z POST
    }
  });
}