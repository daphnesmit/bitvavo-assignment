import { ColumnDef } from '@tanstack/react-table';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { markets } from '../../data/markets';
import { Ticker24hUpdate, bitvavoClient } from '../../utils/bitvavo';
import { calculateChange } from '../../utils/calculateChange';
import { getMinimumFractionDigitsPrice } from '../../utils/getMinimumFractionDigitsPrice';
import { slugify } from '../../utils/slugify';
import { Loader } from '../Loader/Loader';
import MarketIcon from '../MarketIcon/MarketIcon';
import { Table } from '../Table/Table';
import { Link } from '../Link/Link';

interface Market {
  market: string;
  price: string | null;
  change: string | null;
  volume: string | null;
}

const getMarketsTableData = (data?: Ticker24hUpdate[]) => {
  return data?.map((asset: Ticker24hUpdate) => ({
    market: asset.market,
    price: asset.last,
    change: calculateChange(asset),
    volume: asset.volumeQuote,
  }));
};

export const MarketsTable = () => {
  const { isLoading, error, data, isFetching } = useQuery<Ticker24hUpdate[]>({
    queryKey: ['ticker24h'],
    queryFn: bitvavoClient.ticker24h,
  });

  console.log('isFetching', isFetching);
  console.log('isLoading', isLoading);
  console.log('error', error);
  console.log('data', data);
  const assets = useMemo(() => getMarketsTableData(data), [data]);

  const columns = useMemo<ColumnDef<Market>[]>(
    () => [
      {
        accessorKey: 'market',
        header: 'Market',
        cell: ({ getValue }) => {
          const [icon] = getValue<string>().split('-');
          const market = markets[getValue<string>()] || getValue<string>();

          return (
            <a href={`https://bitvavo.com/en/${slugify(market)}/price`}>
              <div className="flex items-center">
                <span>
                  <MarketIcon market={icon.toLowerCase()} />
                </span>
                <div className="flex flex-col pl-4">
                  <span>{market}</span>
                  <span className="text-xs text-gray-500">{icon}</span>
                </div>
              </div>
            </a>
          );
        },
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => {
          const price = Number(row.original.price);

          if (!row.original.price || isNaN(price)) {
            return null;
          }

          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: getMinimumFractionDigitsPrice(price),
          }).format(price);
        },
      },

      {
        accessorKey: 'change',
        header: 'Change (24h)',
        cell: ({ row }) => {
          if (!row.original.change) {
            return null;
          }
          if (row.original.change === '0.00') {
            return <span className="text-gray-500">{row.original.change}%</span>;
          }
          if (row.original.change.includes('-')) {
            return <span className="text-rose-600">{row.original.change}%</span>;
          }
          return <span className="text-green-600">{row.original.change}%</span>;
        },
      },
      {
        accessorFn: (asset) => Number(asset.volume),
        accessorKey: 'volume',
        header: 'Volume',
        cell: ({ row }) => {
          const volume = Number(row.original.volume);
          if (!row.original.volume || isNaN(volume)) {
            return null;
          }

          return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(volume);
        },
      },
      {
        header: 'link',
        enableSorting: false,
        cell: ({ row }) => {
          const market = markets[row.original.market] || row.original.market;

          return <Link href={`https://bitvavo.com/en/${slugify(market)}/price`} label="Buy" />;
        },
      },
    ],
    [],
  );

  if (isLoading) return <Loader />;

  if (!assets) return null;
  return (
    <Table<Market>
      columns={columns}
      data={assets}
      initialState={{
        sorting: [
          {
            id: 'volume',
            desc: true,
          },
        ],
      }}
    />
  );
};
