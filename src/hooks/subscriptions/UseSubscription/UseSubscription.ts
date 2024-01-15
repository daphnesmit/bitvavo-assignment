import { useCallback, useMemo, useState } from 'react';
import { queryClient } from '../../../utils/queryClient';
import {
  OnCloseFunc,
  OnErrorFunc,
  OnMessageFunc,
  OnOpenFunc,
  SocketResponse,
  UseSocketProps,
  useSocket,
} from '../UseSocket/UseSocket';
import { updateTicker24Data } from './utils';
import { WebSocketEvent, WebSocketInput } from './types';
import { Ticker24hData } from '../../../utils/queries';

/** useSubscription hook */
export type SendDataFunc = (props: {
  name: string;
  action: 'subscribe' | 'unsubscribe';
  channel: WebSocketInput['channels'][number];
}) => void;
interface UseSubscriptionReturn<T extends WebSocketEvent, J extends WebSocketInput>
  extends Pick<SocketResponse<T, J>, 'connect' | 'readyState' | 'socket'> {
  sendData: SendDataFunc;
  hasError: boolean;
}
const useSubscription: <T extends WebSocketEvent, J extends WebSocketInput>(
  params?: UseSocketProps<T>,
) => UseSubscriptionReturn<T, J> = <T extends WebSocketEvent, J extends WebSocketInput>(
  params?: UseSocketProps<T>,
) => {
  const { endpoint, onClose: onCloseProp, onOpen: onOpenProp, onError: onErrorProp } = params || {};
  const [hasError, setError] = useState(false);

  /**
   * Handle incoming messages from the websocket
   */
  const onMessage: OnMessageFunc<T> = useCallback((_, data) => {
    switch (data.event) {
      case 'ticker24h':
        // Merge the query cache with the new data
        queryClient.setQueryData(['ticker24h'], (oldData?: Ticker24hData[]) => {
          return updateTicker24Data(oldData || [], data.data);
        });
        break;
    }
  }, []);

  const onOpen: OnOpenFunc = useCallback(
    (event) => {
      setError(false);
      onOpenProp?.(event);
    },
    [onOpenProp],
  );

  const onClose: OnCloseFunc = useCallback(
    (event) => {
      setError(false);
      onCloseProp?.(event);
    },
    [onCloseProp],
  );

  const onError: OnErrorFunc = useCallback(
    (event) => {
      setError(true);
      onErrorProp?.(event);
    },
    [onErrorProp],
  );

  const {
    connect,
    readyState,
    sendData: sendDataToSocket,
    socket,
  } = useSocket<T, J>({
    endpoint,
    onMessage,
    onOpen,
    onClose,
    onError,
  });

  const sendData: SendDataFunc = useCallback(
    ({ name, action, channel }) => {
      sendDataToSocket(`${action}${name}`, {
        action,
        channels: [channel],
      } as J);
    },
    [sendDataToSocket],
  );

  return useMemo(
    () => ({
      connect,
      hasError,
      sendData,
      readyState,
      socket,
    }),
    [connect, hasError, sendData, readyState, socket],
  );
};

export { useSubscription };
