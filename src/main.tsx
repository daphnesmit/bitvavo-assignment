import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { queryClient } from './utils/queryClient.ts';
import SocketProvider from './hooks/subscriptions/UseSocket/SocketProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SocketProvider url={import.meta.env.VITE_BITVAVO_WS_URL as string}>
        <App />
      </SocketProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
