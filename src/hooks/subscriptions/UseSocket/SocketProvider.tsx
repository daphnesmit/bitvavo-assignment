import { FC, PropsWithChildren, useCallback, useRef } from 'react';
import { SocketContext } from './context';

export interface SocketProviderProps {
  url?: string;
}
const SocketProvider: FC<PropsWithChildren<SocketProviderProps>> = ({ children, url }) => {
  const sockets = useRef<Record<string, WebSocket>>({});

  const connect: ({ path }: { path: string }) => WebSocket = useCallback(({ path }) => {
    const socket = sockets.current[path];
    if (socket) {
      const { readyState } = socket;
      if (readyState === WebSocket.OPEN || readyState === WebSocket.CONNECTING) return socket;
    }
    const _socket = new WebSocket(path);
    sockets.current[path] = _socket;
    return _socket;
  }, []);

  return <SocketContext.Provider value={{ connect, url }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
