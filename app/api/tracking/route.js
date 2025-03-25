import axios from "axios";
import * as cheerio from "cheerio";
import validator from 'validator';
import fs from 'fs/promises';
import path from 'path';

const TRANSLATION_CACHE_PATH = path.join(process.cwd(), 'translations.json');
const TRANSLATION_DELAY = 1500;
const MAX_RETRIES = 2;

const TRACKING_URLS = [
  "http://106.55.5.75:8082/en/trackIndex.htm",
  "http://114.132.51.252:8082/en/trackIndex.htm",
  "http://47.112.107.11:8082/en/trackIndex.htm",
  "http://39.101.71.24:8082/en/trackIndex.htm",
  "http://120.78.2.65:8082/en/trackIndex.htm",
  "http://www.hsd-ex.com:8082/trackIndex.htm",
  "http://www.gdasgyl.com:8082/en/trackIndex.htm"
];

const LABEL_NORMALIZATION = {
  "trackingNumber": ["trackingNumber", "Numer śledzenia", "跟踪号码", "رقم التتبع", "Tracking Number"],
  "referenceNo": ["reference No.", "Numer referencyjny", "参考编号", "رقم المرجع", "Reference Number"],
  "country": ["country", "Kraj", "国家", "البلد", "Country"],
  "date": ["date", "Data", "日期", "التاريخ", "Date"],
  "theLastRecord": ["the last record", "Ostatni status", "最后记录", "آخر سجل", "Last Record"],
  "consigneeName": ["consigneeName", "Odbiorca", "收货人姓名", "اسم المستلم", "Consignee Name"],
};

function normalizeLabel(label) {
  for (const [key, variants] of Object.entries(LABEL_NORMALIZATION)) {
    if (variants.includes(label)) return key;
  }
  return label;
}

async function loadTranslationCache() {
  try {
    const data = await fs.readFile(TRANSLATION_CACHE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(TRANSLATION_CACHE_PATH, JSON.stringify({}), 'utf-8');
      return {};
    }
    console.error('Błąd wczytywania cache:', error.message);
    return {};
  }
}

async function saveTranslationCache(cache) {
  try {
    await fs.writeFile(TRANSLATION_CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (error) {
    console.error('Błąd zapisywania cache:', error.message);
  }
}

async function translateStatus(status, cache) {
  if (cache[status]) return cache[status];
  if (!process.env.DEEPL_API_KEY) return status;

  try {
    await new Promise(resolve => setTimeout(resolve, TRANSLATION_DELAY));
    
    const response = await axios.post(
      'https://api-free.deepl.com/v2/translate',
      new URLSearchParams({
        auth_key: process.env.DEEPL_API_KEY,
        text: status,
        target_lang: 'PL'
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 10000,
        validateStatus: (status) => status < 500
      }
    );

    if (response.status === 429) {
      console.warn('Limit DeepL osiągnięty');
      return status;
    }

    const translated = response.data?.translations?.[0]?.text || status;
    cache[status] = translated;
    await saveTranslationCache(cache);
    return translated;
  } catch (error) {
    console.error('Błąd tłumaczenia:', error.message);
    return status;
  }
}

async function sendDiscordNotification(documentCode, trackingData) {
  if (!process.env.DISCORD_WEBHOOK_URL) return;

  try {
    const payload = {
      content: `Nowy numer: **${documentCode}**`,
      username: 'TrackingBot',
      embeds: [{
        title: "Informacje",
        color: 0x00FF00,
        fields: Object.entries(trackingData["Informacje główne"]).map(([name, value]) => ({
          name,
          value: value.toString(),
          inline: true
        }))
      }]
    };

    await axios.post(process.env.DISCORD_WEBHOOK_URL, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Błąd Discord:', error.message);
  }
}

export async function POST(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const { documentCode } = await request.json();
  
  if (!documentCode || !validator.isAlphanumeric(documentCode)) {
    return new Response(JSON.stringify({ error: "Invalid tracking number" }), { status: 400 });
  }

  try {
    let trackingData = null;
    const translationCache = await loadTranslationCache();
    
    for (const url of TRACKING_URLS) {
      let retryCount = 0;
      while (retryCount <= MAX_RETRIES) {
        try {
          const response = await axios.post(
            url,
            new URLSearchParams({ documentCode }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" }, timeout: 10000 }
          );

          if (response.data && typeof response.data === "string") {
            const $ = cheerio.load(response.data);
            const labels = [];
            const values = [];

            $("div.menu_ > ul").first().find("li").each((_, el) => labels.push($(el).text().trim()));
            $("div.menu_ > ul").eq(1).find("li").each((_, el) => values.push($(el).text().trim()));

            const dataMap = labels.reduce((acc, label, index) => {
              acc[normalizeLabel(label)] = values[index] || "";
              return acc;
            }, {});

            if (dataMap.trackingNumber) {
              const mainInfo = {
                "Numer śledzenia": dataMap.trackingNumber,
                "Kraj": dataMap.country || "N/A",
                "Data": dataMap.date || "N/A",
                "Ostatni status": await translateStatus(dataMap.theLastRecord, translationCache),
                "Odbiorca": dataMap.consigneeName || "N/A"
              };

              const details = [];
              $("table tr").each((_, row) => {
                const cells = $(row).find("td");
                if (cells.length === 3) details.push({
                  Data: $(cells[0]).text().trim(),
                  Lokalizacja: $(cells[1]).text().trim(),
                  Status: $(cells[2]).text().trim()
                });
              });

              trackingData = {
                "Informacje główne": mainInfo,
                "Szczegóły przesyłki": await Promise.all(details.map(async d => ({
                  Data: d.Data,
                  Lokalizacja: d.Lokalizacja,
                  Status: await translateStatus(d.Status, translationCache)
                }))),
                "Źródło": url
              };

              await sendDiscordNotification(documentCode, trackingData);
              return new Response(JSON.stringify(trackingData), { status: 200 });
            }
          }
          break;
        } catch (error) {
          if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
            continue;
          }
          console.warn(`Błąd ${url}:`, error.message);
          break;
        }
      }
    }

    return new Response(JSON.stringify({ error: "Nie znaleziono danych" }), { status: 404 });
  } catch (error) {
    console.error("Błąd serwera:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}