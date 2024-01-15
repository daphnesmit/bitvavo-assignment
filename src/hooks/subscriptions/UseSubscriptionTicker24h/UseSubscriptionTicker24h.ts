import { useEffect, useRef } from 'react';
import { READY_STATE } from '../UseSocket/UseSocket';
import { SendDataFunc, useSubscription } from '../UseSubscription/UseSubscription';
import { InputTicker24h, EventTicker24h } from '../UseSubscription/types';

interface UseSubscriptionTicker24hReturn {
  readyState: READY_STATE;
  hasError: boolean;
  sendData: SendDataFunc;
}
interface UseSubscriptionTicker24hProps {
  markets: string[];
}
const useSubscriptionTicker24h = ({
  markets,
}: UseSubscriptionTicker24hProps): UseSubscriptionTicker24hReturn => {
  const hasSubscribed = useRef<boolean>(false);
  const { sendData, readyState, hasError } = useSubscription<EventTicker24h, InputTicker24h>();

  /**
   * React StrictMode calls the useEffect twice on mount in DEV mode;
   *
   * Calling the sendData function twice is not a problem because the socket will just open and close twice
   * But let's keep track of the subscription state to prevent unnecessary calls.
   */
  useEffect(() => {
    if (hasError || hasSubscribed.current) return;

    hasSubscribed.current = true;

    sendData({ name: 'ticker24h', action: 'subscribe', channel: { name: 'ticker24h', markets } });
  }, [hasError, markets, sendData]);

  return { readyState, sendData, hasError };
};

export { useSubscriptionTicker24h };
