import { Coin, CoinDetail } from "@/types/market";

const BASE_URL = "https://api.coingecko.com/api/v3";

const API_KEY = process.env.NEXT_PUBLIC_CG_API_KEY;

const withApiKey = (url: string) => {
  const separator = url.includes("?") ? "&" : "?";
  return API_KEY ? `${url}${separator}x_cg_demo_api_key=${API_KEY}` : url;
};

async function fetchWithTimeout(
  url: string,
  timeoutMs: number = 10000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchTopCoins(): Promise<Coin[]> {
  const url = withApiKey(`${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h`);
  const response = await fetchWithTimeout(url);
  const data: Coin[] = await response.json();
  return data;
}

export async function fetchCoinDetail(id: string): Promise<CoinDetail> {
  const url = withApiKey(`${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`);
  const response = await fetchWithTimeout(url);
  const raw = await response.json();

  // CoinGecko /coins/{id} has a different shape — normalize it
  const detail: CoinDetail = {
    id: raw.id,
    symbol: raw.symbol,
    name: raw.name,
    image: raw.image?.large || raw.image?.small || "",
    current_price: raw.market_data?.current_price?.usd ?? 0,
    price_change_percentage_24h:
      raw.market_data?.price_change_percentage_24h ?? 0,
    market_cap: raw.market_data?.market_cap?.usd ?? 0,
    market_cap_rank: raw.market_cap_rank ?? 0,
    high_24h: raw.market_data?.high_24h?.usd ?? 0,
    low_24h: raw.market_data?.low_24h?.usd ?? 0,
    total_volume: raw.market_data?.total_volume?.usd ?? 0,
    circulating_supply: raw.market_data?.circulating_supply ?? 0,
    ath: raw.market_data?.ath?.usd ?? 0,
    ath_date: raw.market_data?.ath_date?.usd ?? "",
    description: { en: raw.description?.en ?? "" },
  };

  return detail;
}

export async function fetchCoinMarketChart(id: string, days: number): Promise<{ prices: [number, number][] }> {
  const url = withApiKey(`${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`);
  const response = await fetchWithTimeout(url);
  return response.json();
}
