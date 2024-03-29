export interface Ticker24hData {
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

interface Queries {
  ticker24h: () => Promise<Ticker24hData[] | undefined>;
}

async function get<T>(path: string, options = {}): Promise<T | undefined> {
  const response = await fetch(`${process.env.VITE_BITVAVO_REST_URL}${path}`, options);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

const queries: Queries = {
  ticker24h: async function (options = {}) {
    return get<Ticker24hData[] | undefined>('/ticker/24h', options);
  },
};

export { queries };
