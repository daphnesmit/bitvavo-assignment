import { useEffect } from 'react';
import { READY_STATE } from '../UseSocket/UseSocket';
import { useSubscription } from '../UseSubscription/UseSubscription';
import { InputTicker24h, EventTicker24h } from '../UseSubscription/types';

interface UseSubscriptionTicker24hReturn {
  readyState: READY_STATE;
  hasError: boolean;
  sendData: (input: InputTicker24h) => void;
}
interface UseSubscriptionTicker24hProps {
  markets: string[];
}
const useSubscriptionTicker24h = ({
  markets,
}: UseSubscriptionTicker24hProps): UseSubscriptionTicker24hReturn => {
  const { connect, sendData, readyState, hasError } = useSubscription<
    EventTicker24h,
    InputTicker24h
  >({
    onOpen: () => {
      // Subscribe to the ticker24h channel
      sendData({
        action: 'subscribe',
        channels: [
          {
            name: 'ticker24h',
            markets,
          },
        ],
      });
    },
  });

  /**
   * React StrictMode calls the useEffect twice on mount;
   * so connect() is called twice
   * when unmouting the component, the socket is closed so this should be fine
   */
  useEffect(() => {
    connect();
  }, [connect]);

  return { readyState, sendData, hasError };
};

export { useSubscriptionTicker24h };
