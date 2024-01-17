import { FC, PropsWithChildren, useCallback, useRef } from 'react';
import { SocketContext } from './context';

export interface SocketProviderProps {
  url?: string;
}
const SocketProvider: FC<PropsWithChildren<SocketProviderProps>> = ({ children, url }) => {
  const sockets = useRef<Record<string, WebSocket>>({});

  /**
   * Provides a socket connection for the application.
   *
   * @remarks
   * This component is responsible for establishing and managing a socket connection
   * to a server. It wraps the child components with a context provider, allowing them
   * to access the socket connection via the `useSocket` hook.
   *
   * @example
   * ```tsx
   * import { SocketProvider } from './hooks/subscriptions/UseSocket/SocketProvider';
   *
   * function App() {
   *   return (
   *     <SocketProvider>
   *      // app content
   *     </SocketProvider>
   *   );
   * }
   */
  const connect: ({ path }: { path: string }) => WebSocket = useCallback(({ path }) => {
    const socket = sockets.current[path];
    if (socket) {
      const { readyState } = socket;
      // If the socket is already open or connecting, return it.
      if (readyState === WebSocket.OPEN || readyState === WebSocket.CONNECTING) return socket;
    }
    // Otherwise, create a new socket and return it.
    const _socket = new WebSocket(path);
    sockets.current[path] = _socket;
    return _socket;
  }, []);

  return <SocketContext.Provider value={{ connect, url }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
