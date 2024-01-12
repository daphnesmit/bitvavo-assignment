import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  TableOptions,
  useReactTable,
} from '@tanstack/react-table';

import React, { forwardRef, useRef, useState } from 'react';
import { TableBody } from './TableBody';
import { TableHead } from './TableHead';
import { TableSearch } from './TableSearch';

interface TableProps<TData>
  extends Pick<TableOptions<TData>, 'columns' | 'data'>,
    Partial<Omit<TableOptions<TData>, 'columns' | 'data'>> {
  gridColumns?: string;
}

const TableScroller = ({ children }: React.PropsWithChildren) => {
  return <div className="w-full overflow-x-auto">{children}</div>;
};

const TableElement = forwardRef(
  ({ children }: React.PropsWithChildren, ref: React.Ref<HTMLTableElement>) => {
    return (
      <table
        ref={ref}
        className="grid w-max min-w-[800px] border-collapse border-spacing-0 text-gray-900 md:min-w-full"
      >
        {children}
      </table>
    );
  },
);

export function Table<T>({ columns, data, gridColumns, ...rest }: TableProps<T>) {
  const tableRef = useRef<HTMLTableElement>(null);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: import.meta.env.DEV,
    ...rest,
  });

  return (
    <div className="flex flex-col items-end">
      <TableSearch
        globalFilter={globalFilter}
        onChange={(value) => setGlobalFilter(String(value))}
      />
      <TableScroller>
        <TableElement ref={tableRef}>
          <TableHead table={table} gridColumns={gridColumns} />
          <TableBody table={table} gridColumns={gridColumns} tableRef={tableRef} />
        </TableElement>
      </TableScroller>
    </div>
  );
}
