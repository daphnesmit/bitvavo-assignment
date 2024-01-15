/* eslint-disable react-refresh/only-export-components */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderResult } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';

import SocketProvider from '../hooks/subscriptions/UseSocket/SocketProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ turns retries off
      retry: false,
    },
  },
});

const WithProviders = ({ children }: React.PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider url={process.env.VITE_BITVAVO_WS_URL as string}>{children}</SocketProvider>
    </QueryClientProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: RenderOptions): RenderResult =>
  render(ui, { wrapper: WithProviders, ...options });

// re-export everything
export * from '@testing-library/react';
export { customRender as render };
