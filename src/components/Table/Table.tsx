import {
  getCoreRowModel,
  getSortedRowModel,
  TableOptions,
  useReactTable,
} from '@tanstack/react-table';

import React, { forwardRef } from 'react';
import { TableBody } from './TableBody';
import { TableHead } from './TableHead';

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
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: import.meta.env.DEV,
    ...rest,
  });

  const tableRef = React.useRef<HTMLTableElement>(null);

  return (
    <TableScroller>
      <TableElement ref={tableRef}>
        <TableHead table={table} gridColumns={gridColumns} />
        <TableBody table={table} gridColumns={gridColumns} tableRef={tableRef} />
      </TableElement>
    </TableScroller>
  );
}
