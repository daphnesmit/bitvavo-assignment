/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSocketContext } from './context';

export declare type SocketJSONType = Record<never, never>;
export enum READY_STATE {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}
/** Event types */
export declare type OnOpenFunc = (data: unknown | never) => void;
export declare type OnCloseFunc = (data: unknown | never) => void;
export declare type OnErrorFunc = (data: unknown | never) => void;
export declare type OnMessageFunc<T extends SocketJSONType> = (
  data: unknown | never,
  json: T,
) => void;
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
  sendData: (data: J) => void;
}
export interface UseSocketProps<T extends SocketJSONType> extends SocketEvents<T> {
  endpoint?: string;
  url?: string;
  reconnectInterval?: number;
  // TODO: implement max reconnect attempts
  // reconnectAttempts?: number;
}

/**
 * Normally I would use a library for this like react-use-websocket, because dealing with websockets in React StrictMode is painful.
 * For the purpose of this assessment I have created my own useSocket hook.
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
    reconnectInterval = 1000,
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
  const reconnectTimer = useRef<number>(reconnectInterval);

  const onCloseRef = useRef<(event: any) => void>();
  const onMessageRef = useRef<(event: any) => void>();
  const onErrorRef = useRef<(event: any) => void>();
  const onOpenRef = useRef<(event: any) => void>();

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
    reconnect.current = true;
    _socket.onclose = onCloseRef.current || null;
    _socket.onopen = onOpenRef.current || null;
    _socket.onerror = onErrorRef.current || null;
    _socket.onmessage = onMessageRef.current || null;
    socket.current = _socket;

    setSocketState((old) => ({
      ...old,
      readyState: _socket.readyState,
    }));

    return _socket;
  }, [propUrl, contextUrl, endpoint, contextConnect]);

  const onopen = useCallback(
    (event: any) => {
      setSocketState((old) => ({ ...old, readyState: WebSocket.OPEN }));
      return onOpen?.(event);
    },
    [onOpen],
  );

  const onmessage = useCallback(
    (event: any) => {
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

  const onclose = useCallback(
    (event: any) => {
      setSocketState((old) => ({ ...old, readyState: WebSocket.CLOSED }));

      // Connection Closed; try to reconnect when reconnect is true
      if (reconnect.current) {
        setTimeout(() => {
          console.warn('Reconnecting...', reconnectTimer.current);
          connect();
        }, reconnectTimer.current * 2);
      }
      onClose?.(event);
    },
    [onClose, connect],
  );

  // Fixme: Some anys used here because addEventListener websocket types keep complaining
  const onerror = useCallback(
    (event: any) => {
      setSocketState((old) => ({ ...old, readyState: WebSocket.CLOSING }));
      onError?.(event);
    },
    [onError],
  );

  const sendData = useCallback((data: J) => {
    socket.current?.send(JSON.stringify(data));
  }, []);

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
        close();
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
   * Close the websocket connection on unmount
   */
  useEffect(() => {
    return () => {
      close(1000, 'Disconnecting Socket on unmount!');
    };
  }, [close]);

  return {
    connect,
    socket: socket.current,
    sendData,
    ...socketState,
  } as SocketResponse<T, J>;
};

export { useSocket };
