import {
  getCoreRowModel,
  getSortedRowModel,
  TableOptions,
  useReactTable,
} from '@tanstack/react-table';

import React from 'react';
import { TableBody } from './TableBody';
import { TableHead } from './TableHead';

interface TableProps<TData>
  extends Pick<TableOptions<TData>, 'columns' | 'data'>,
    Partial<Omit<TableOptions<TData>, 'columns' | 'data'>> {}

export function Table<T>({ columns, data, ...rest }: TableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    ...rest,
  });

  const tableRef = React.useRef<HTMLTableElement>(null);

  return (
    <div className="w-full overflow-x-auto">
      <table
        ref={tableRef}
        className="grid w-max min-w-[800px] border-collapse border-spacing-0 text-gray-900 md:min-w-full"
      >
        <TableHead table={table} />
        <TableBody table={table} tableRef={tableRef} />
      </table>
    </div>
  );
}
