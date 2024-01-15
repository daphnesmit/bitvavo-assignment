import { useEffect, useState, useCallback } from 'react';

interface WebSocketProps {
  url: string;
  subpath?: string;
  onMessage?: (event: MessageEvent) => void;
  onReconnect?: (retryCount: number) => void;
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: Event) => void;
  shouldConnect?: boolean;
  maxRetries?: number;
  reconnectInterval?: number;
}

const useWebSocket = ({
  url,
  subpath = '',
  onMessage,
  onReconnect,
  onOpen,
  onClose,
  onError,
  shouldConnect = true,
  maxRetries = 5,
  reconnectInterval = 1000,
}: WebSocketProps) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [messageQueue, setMessageQueue] = useState<Array<Record<string, any>>>([]);

  const connectWebSocket = useCallback(() => {
    const newSocket = new WebSocket(`${url}/${subpath}`);
    setSocket(newSocket);

    newSocket.onmessage = onMessage as (event: MessageEvent) => void;
    newSocket.onopen = () => {
      setRetryCount(0);
      onOpen && onOpen();
      // Process queued messages once the connection is open
      messageQueue.forEach((message) => {
        newSocket.send(JSON.stringify(message));
      });
      setMessageQueue([]);
    };
    newSocket.onclose = (event: CloseEvent) => {
      onClose && onClose(event);
      if (event.code !== 1000) {
        if (retryCount < maxRetries && shouldConnect) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            onReconnect && onReconnect(retryCount + 1);
            connectWebSocket();
          }, reconnectInterval);
        }
      }
    };
    newSocket.onerror = (error: Event) => {
      onError && onError(error);
    };

    return () => {
      newSocket.close();
    };
  }, [
    url,
    subpath,
    onMessage,
    onReconnect,
    onOpen,
    onClose,
    onError,
    shouldConnect,
    maxRetries,
    reconnectInterval,
    retryCount,
    messageQueue,
  ]);

  useEffect(() => {
    if (shouldConnect) {
      const cleanup = connectWebSocket();
      return () => cleanup();
    }
  }, [shouldConnect, connectWebSocket]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && shouldConnect) {
        connectWebSocket();
      } else {
        socket && socket.close();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      socket && socket.close();
    };
  }, [socket, shouldConnect, connectWebSocket]);

  const sendMessage = (message: Record<string, any>) => {
    if (socket?.readyState === WebSocket.OPEN) {
      // Send the message if the connection is open
      socket.send(JSON.stringify(message));
    } else {
      // Queue the message if the connection is not open
      setMessageQueue((prevQueue) => [...prevQueue, message]);
    }
  };

  return { sendMessage };
};

export default useWebSocket;
