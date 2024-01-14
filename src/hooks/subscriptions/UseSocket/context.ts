import { createContext, useContext } from 'react';

export interface SocketContextProps {
  url?: string;
  connect: (params: { path: string }) => WebSocket;
}
const SocketContext = createContext({} as SocketContextProps);

const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocketContext must be used within an SocketContext.Provider');
  }
  return context;
};

export { SocketContext, useSocketContext };
