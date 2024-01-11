import { ColumnDef } from '@tanstack/react-table';

import { useMemo } from 'react';
import { Table } from '../Table/Table';

interface Asset {
  asset: string;
  price: number;
  change: number;
  volume: number;
}
export const AssetsTable = () => {
  // Mock data for demonstration purposes
  const data = useMemo(
    () => [
      { asset: 'btc', price: 50000, change: 0.05, volume: 1000 },
      { asset: 'eth', price: 3000, change: -0.02, volume: 800 },
      { asset: 'ltc', price: 150, change: 0.1, volume: 200 },
      // Add 50 more rows
      ...Array.from({ length: 50 }, (_, index) => ({
        asset: `asset${index + 4}`, // asset4, asset5, ..., asset53
        price: Math.random() * 1000,
        change: (Math.random() - 0.5) / 10,
        volume: Math.floor(Math.random() * 1000),
      })),
      { asset: 'aaaa', price: 50000, change: 0.05, volume: 1000 },
      // Add more rows as needed
    ],
    [],
  );

  const columns = useMemo<ColumnDef<Asset>[]>(
    () => [
      {
        accessorKey: 'asset',
        header: 'Asset',
      },
      {
        accessorKey: 'price',
        header: 'Price',
      },
      {
        accessorKey: 'change',
        header: 'Change (24h)',
      },
      {
        accessorKey: 'volume',
        header: 'Volume',
      },
    ],
    [],
  );

  return <Table<Asset> columns={columns} data={data} />;
};
