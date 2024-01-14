import { markets } from '../../data/markets';
import { useSubscriptionTicker24h } from '../../hooks/subscriptions/UseSubscriptionTicker24h/UseSubscriptionTicker24h';
import { Loader } from '../Loader/Loader';
import { MarketsProvider } from './MarketsProvider';
import { MarketsStatusIndicator } from './MarketsStatusIndicator';
import { MarketsTable } from './MarketsTable';
import { useMarkets } from './UseMarkets';

export const MarketsContainer = ({ children }: React.PropsWithChildren) => {
  const { isLoading, hasError } = useMarkets();

  /**
   * TODO: implement a skeleton loader in the table
   */
  if (isLoading) return <Loader />;

  if (hasError) {
    return (
      <div className="mx-auto text-center lg:w-4/6">
        <h2 className="mb-5 text-4xl font-bold">Market data not available</h2>
        <p className=" text-rose-700">
          We are very sorry. The market data could not be loaded. Please come back later.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export const Markets = () => {
  const { readyState, hasError } = useSubscriptionTicker24h({
    markets: Object.keys(markets),
  });

  return (
    <MarketsProvider>
      <MarketsContainer>
        <div>
          <MarketsStatusIndicator statusCode={hasError ? 4 : readyState} />
          <MarketsTable />
        </div>
      </MarketsContainer>
    </MarketsProvider>
  );
};
