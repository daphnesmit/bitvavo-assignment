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

interface BitvavoOptions {
  REST_URL: string;
  WS_URL: string;
}

export interface BitvavoSubscriptions {
  ticker24h: (markets: string[], callback: (data: Ticker24hData[]) => void) => void;
}
export interface BitvavoQueries {
  ticker24h: () => Promise<Ticker24hData[]>;
}

interface BitvavoWebsocket {
  close: () => void;
}

interface BitvavoReturn {
  query: BitvavoQueries;
  subscription: BitvavoSubscriptions;
  websocket: BitvavoWebsocket;
}

type Ticker24hCallback = ((data: Ticker24hData[]) => void) | undefined;

function bitvavo({ REST_URL, WS_URL }: BitvavoOptions): BitvavoReturn {
  async function get<T>(path: string, options = {}): Promise<T> {
    const response = await fetch(`${REST_URL}${path}`, options);
    return response.json();
  }

  let websocket: WebSocket | null = null;
  let hasNotConnected = false;
  let hasStarted = false;

  let ticker24hCallback: Ticker24hCallback = undefined;

  function handleSocketMessage({ event, data }: { event: string; data: unknown }) {
    switch (event) {
      case 'ticker24h':
        ticker24hCallback?.(data as Ticker24hData[]);
        // websocket?.close();
        break;
    }
  }

  function sendToSocket(data: Record<string, unknown>) {
    console.debug('>>> SEND TO SOCKET: ', data);
    websocket?.send(JSON.stringify(data));
  }
  async function startSocket() {
    console.log('TRY START');
    if (websocket) return;

    console.log('START');
    const ws = new WebSocket(WS_URL);
    websocket = ws;

    ws.onopen = async (event) => {
      console.log('onopen', event);
      hasNotConnected = false;
    };
    ws.onmessage = (event) => {
      console.log('onmessage', event);
      const data = JSON.parse(event.data) as { event: string; data: unknown };
      console.log('onmessage - data', data);
      handleSocketMessage(data);
    };
    ws.onclose = function (event) {
      console.log('onclose', event);
      hasStarted = false;
    };
    ws.onerror = function (event) {
      console.log('onerror', event);
      hasNotConnected = true;
    };

    while (ws.readyState !== 1 && hasNotConnected === false) {
      await new Promise((r) => setTimeout(r, 100));
    }
    return ws;
  }

  async function initSocket() {
    console.log('INIT websocket - websocket', websocket);
    console.log('INIT websocket - hasNotConnected', hasNotConnected);
    console.log('INIT websocket - hasStarted', hasStarted);
    if (!websocket && !hasStarted) {
      hasStarted = true;
      console.log('START websocket');
      await startSocket();
    } else if (!websocket) {
      while (!websocket) {
        await new Promise((r) => setTimeout(r, 100));
      }
    }
  }
  return {
    query: {
      ticker24h: async function (options = {}) {
        return get<Ticker24hData[]>('/ticker/24h', options);
      },
    },
    subscription: {
      ticker24h: async function (
        markets: string[] = [],
        callback: (data: Ticker24hData[]) => void,
      ) {
        console.log('SUBSCRIBE ticker24h');
        ticker24hCallback = callback;

        await initSocket();
        console.log('INITED SOCKET!');
        sendToSocket({
          action: 'subscribe',
          channels: [{ name: 'ticker24h', markets }],
        });
      },
    },
    websocket: {
      close: async function () {
        if (!websocket) return;
        console.log('CLOSE websocket - hasNotConnected', hasNotConnected);
        console.log('CLOSE websocket - hasStarted', hasStarted);
        websocket.close();
      },
    },
  };
}

export const bitvavoClient = bitvavo({
  REST_URL: import.meta.env.VITE_BITVAVO_REST_URL,
  WS_URL: import.meta.env.VITE_BITVAVO_WS_URL,
});
