export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number;
  high_24h: number;
  low_24h: number;
  total_volume: number;
  sparkline_in_7d?: { price: number[] };
}

export interface CoinDetail extends Coin {
  circulating_supply: number;
  ath: number;
  ath_date: string;
  description: { en: string };
}
