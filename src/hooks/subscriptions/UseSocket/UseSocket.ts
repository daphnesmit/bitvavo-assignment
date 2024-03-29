/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSocketContext } from './context';

export declare type SocketJSONType = Record<never, never>;
export enum READY_STATE {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}
/** Event types */
export declare type OnOpenFunc = (data: any) => void;
export declare type OnCloseFunc = (data: any) => void;
export declare type OnErrorFunc = (data: any) => void;
export declare type OnMessageFunc<T extends SocketJSONType> = (data: any, json: T) => void;
export declare type OnTabLeaveFunc = (readyState: READY_STATE) => void;
export declare type OnTabEnterFunc = (readyState: READY_STATE) => void;
export interface SocketEvents<T extends SocketJSONType> {
  onOpen?: OnOpenFunc;
  onClose?: OnCloseFunc;
  onError?: OnErrorFunc;
  onMessage?: OnMessageFunc<T>;
  onTabLeave?: OnTabLeaveFunc;
  onTabEnter?: OnTabEnterFunc;
}

export interface SocketState<T extends SocketJSONType> {
  readyState: READY_STATE;
  lastData?: T;
}

export interface SocketResponse<T extends SocketJSONType, J extends SocketJSONType>
  extends SocketState<T> {
  connect: () => WebSocket;
  socket: WebSocket;
  sendData: (name: string, data: J) => void;
}
export interface UseSocketProps<T extends SocketJSONType> extends SocketEvents<T> {
  endpoint?: string;
  url?: string;
  shouldConnect?: boolean;
  reconnectInterval?: number;
  maxRetries?: number;
}

/**
 * Normally I would use a library for this like react-use-websocket, because dealing with websockets in React StrictMode is painful.
 * For the purpose of this assessment I have created my own useSocket hook.
 *
 * FIXME: This hook is not fully tested and is not production ready. It uses currently a lot of anys and is not fully typed.
 * @see https://www.npmjs.com/package/react-use-websocket
 */
const useSocket: <T extends SocketJSONType, J extends SocketJSONType>(
  params?: UseSocketProps<T>,
) => SocketResponse<T, J> = <T extends SocketJSONType, J extends SocketJSONType>(
  params?: UseSocketProps<T>,
) => {
  const {
    url: propUrl,
    endpoint,
    shouldConnect = true,
    reconnectInterval = 1000,
    maxRetries = 5,
    onClose,
    onError,
    onMessage,
    onOpen,
    onTabEnter,
    onTabLeave,
  } = params || {};

  const { connect: contextConnect, url: contextUrl } = useSocketContext();

  const socket = useRef<WebSocket>();
  const reconnect = useRef<boolean>(false);
  const retryCount = useRef<number>(0);
  const reconnectTimer = useRef<number>(reconnectInterval);

  const onCloseRef = useRef<WebSocket['onclose']>();
  const onMessageRef = useRef<WebSocket['onmessage']>();
  const onErrorRef = useRef<WebSocket['onerror']>();
  const onOpenRef = useRef<WebSocket['onopen']>();
  const subscriptions = useRef<Map<string, any>>(new Map());

  const [socketState, setSocketState] = useState<SocketState<T>>({
    readyState: READY_STATE.CLOSED,
    lastData: undefined,
  });

  const connect: () => WebSocket = useCallback(() => {
    const url = propUrl || contextUrl;

    if (!url) {
      throw new Error('Websocket `url` not provided');
    }

    const path = `${url}${endpoint || ''}`;
    const _socket = contextConnect({ path });

    _socket.onclose = onCloseRef.current || null;
    _socket.onopen = onOpenRef.current || null;
    _socket.onerror = onErrorRef.current || null;
    _socket.onmessage = onMessageRef.current || null;

    reconnect.current = true;
    socket.current = _socket;

    setSocketState((old) => ({
      ...old,
      readyState: _socket.readyState,
    }));

    return _socket;
  }, [propUrl, contextUrl, endpoint, contextConnect]);

  const subscribe = useCallback((subscription: string, data: any) => {
    subscriptions.current.set(subscription, data);
  }, []);

  const resetRetryCount = useCallback(() => {
    retryCount.current = 0;
  }, []);

  const sendSubscriptions = useCallback(() => {
    subscriptions.current.forEach(function (value) {
      socket.current?.send(JSON.stringify(value));
    });
  }, []);

  const onopen: WebSocket['onopen'] = useCallback(
    (event: WebSocketEventMap['open']) => {
      resetRetryCount();
      setSocketState((old) => ({ ...old, readyState: WebSocket.OPEN }));
      sendSubscriptions();

      return onOpen?.(event);
    },
    [onOpen, resetRetryCount, sendSubscriptions],
  );

  const onmessage: WebSocket['onmessage'] = useCallback(
    (event: MessageEvent) => {
      setSocketState((old) => ({ ...old, lastData: event.data }));
      let { data } = event;
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.error('useSocket - onmessage - JSON PARSE error', e);
      }
      onMessage?.(event, data);
    },
    [onMessage],
  );

  const retry = useCallback(() => {
    setTimeout(() => {
      console.warn('Reconnecting...', { maxRetries, retryCount: retryCount.current });
      retryCount.current = retryCount.current + 1;

      connect();
    }, reconnectTimer.current * retryCount.current);
  }, [connect, maxRetries]);

  const onclose: WebSocket['onclose'] = useCallback(
    (event: CloseEvent) => {
      setSocketState((old) => ({ ...old, readyState: WebSocket.CLOSED }));
      onClose?.(event);

      /**
       * Connection Closed; try to reconnect when reconnect is true
       *
       * 1000: Normal Closure. This means that the connection was closed, or is being closed, without any error.
       * 1005: No Status Received: also sometimes gets send back
       *
       * I dont feel like we can rely on status codes here so we just check if we should reconnect manually.
       *
       * @see https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
       */

      if (retryCount.current >= maxRetries || !reconnect.current) {
        return;
      }
      retry();
      onClose?.(event);
    },
    [maxRetries, onClose, retry],
  );

  const onerror: WebSocket['onerror'] = useCallback(
    (event: Event) => {
      setSocketState((old) => ({ ...old, readyState: WebSocket.CLOSING }));
      onError?.(event);
    },
    [onError],
  );

  const sendData = useCallback(
    (name: string, message: J) => {
      // Add the subscription to the list
      subscribe(name, message);

      // Send the message directly if the connection is already open
      if (socket.current?.readyState === WebSocket.OPEN) {
        socket.current.send(JSON.stringify(message));
      }
    },
    [subscribe],
  );

  /**
   * Close the websocket connection; do not reconnect
   */
  const close = useCallback((code?: number, reason?: string) => {
    reconnect.current = false;
    socket.current?.close(code, reason);
  }, []);

  /**
   * When the tab is not focussed, close the connection.
   * When the tab is focussed, try to reconnect.
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!socket.current) return;

      if (document.visibilityState === 'hidden') {
        close(1000);
        onTabLeave?.(socket.current?.readyState);
      } else {
        // Connection Closing but not closed yet; just set reconect to true so it will reconnect on close.
        if (socket.current?.readyState === WebSocket.CLOSING) {
          reconnect.current = true;
          setSocketState((old) => ({ ...old, readyState: WebSocket.CLOSING }));
          onTabEnter?.(WebSocket.CLOSING);
        }
        // Connection Closed; try to reconnect directly
        if (socket.current?.readyState === WebSocket.CLOSED) {
          setSocketState((old) => ({ ...old, readyState: WebSocket.CLOSED }));
          connect();
          onTabEnter?.(WebSocket.CLOSED);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [close, connect, onTabEnter, onTabLeave]);

  /**
   * Because onclose calls connect() again. we get a cirular dependency.
   * With using refs this way, the functions can reference each other without causing a circular dependency issue.
   */
  onCloseRef.current = onclose;
  onErrorRef.current = onerror;
  onOpenRef.current = onopen;
  onMessageRef.current = onmessage;

  /**
   * Check if the socket is we should connect to the socket
   * Close the websocket connection on unmount
   */
  useEffect(() => {
    if (shouldConnect) {
      connect();

      return () => {
        close(1000, 'Disconnecting Socket on unmount!');
      };
    }
  }, [close, connect, shouldConnect]);

  return useMemo(
    () =>
      ({
        connect,
        socket: socket.current,
        sendData,
        ...socketState,
      }) as SocketResponse<T, J>,
    [connect, sendData, socketState],
  );
};

export { useSocket };
