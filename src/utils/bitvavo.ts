export interface Ticker24hUpdate {
  ask: string;
  askSize: string;
  market: string;
  timestamp: number;
  bid: string | null;
  bidSize: string | null;
  high: string | null;
  last: string | null;
  low: string | null;
  open: string | null;
  volume: string | null;
  volumeQuote: string | null;
}

interface BitvavoOptions {
  REST_URL: string;
  WS_URL: string;
}

function bitvavo({ REST_URL, WS_URL }: BitvavoOptions) {
  async function get<T>(path: string, options = {}): Promise<T> {
    const response = await fetch(`${REST_URL}${path}`, options);
    return response.json();
  }

  return {
    ticker24h: async function (options = {}) {
      return get<Ticker24hUpdate[]>('/ticker/24h', options);
    },
  };
}

export const bitvavoClient = bitvavo({
  REST_URL: import.meta.env.VITE_BITVAVO_REST_URL,
  WS_URL: import.meta.env.VITE_BITVAVO_WS_URL,
});
