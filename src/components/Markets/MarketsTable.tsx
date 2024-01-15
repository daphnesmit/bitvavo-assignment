import { ColumnDef } from '@tanstack/react-table';

import { useMemo } from 'react';
import { slugify } from '../../utils/slugify';
import { Link } from '../Link/Link';
import MarketIcon from '../MarketIcon/MarketIcon';
import { Table } from '../Table/Table';
import { useMarkets } from './MarketsProvider/UseMarkets';
import { MarketTableData } from './utils/getMarketsTableData';
import { getMinimumFractionDigitsPrice } from './utils/getMinimumFractionDigitsPrice';

export const MarketsTable = () => {
  const { tableData } = useMarkets();

  const columns = useMemo<ColumnDef<MarketTableData>[]>(
    () => [
      {
        accessorKey: 'market',
        header: 'Market',
        cell: ({ row }) => {
          const icon = row.original.symbol;
          const market = row.original.market;

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
        accessorFn: (asset) => Number(asset.price),
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => {
          const price = Number(row.original.price);

          if (!price || isNaN(price)) {
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

          if (!volume || isNaN(volume)) {
            return null;
          }

          return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(volume);
        },
      },
      {
        accessorKey: 'symbol',
        header: 'link',
        enableSorting: false,
        cell: ({ row }) => {
          const market = row.original.market;

          return <Link href={`https://bitvavo.com/en/${slugify(market)}/price`} label="Buy" />;
        },
      },
    ],
    [],
  );

  return (
    <Table<MarketTableData>
      columns={columns}
      data={tableData}
      gridColumns="30% 15% 1fr 1fr 10%"
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
