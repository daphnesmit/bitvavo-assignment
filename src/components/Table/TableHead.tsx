import { flexRender, Header, Table } from '@tanstack/react-table';

interface TableHeadCellProps<T> {
  header: Header<T, unknown>;
}

function TableHeadCell<T>({ header }: React.PropsWithChildren<TableHeadCellProps<T>>) {
  return (
    <th className="flex">
      <div
        role="button"
        className={`flex w-full justify-between whitespace-nowrap px-4 py-5 ${
          header.column.getCanSort() ? 'cursor-pointer select-none' : ''
        }`}
        onClick={header.column.getToggleSortingHandler()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && header.column.getCanSort()) {
            return header.column.toggleSorting();
          }
        }}
        tabIndex={header.column.getCanSort() ? 0 : undefined}
      >
        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
        <span>
          {{
            asc: ' 🔼',
            desc: ' 🔽',
          }[header.column.getIsSorted() as string] ?? null}
        </span>
      </div>
    </th>
  );
}
interface TableHeadRowProps {
  gridColumns: string;
}

const TableHeadRow = ({ children, gridColumns }: React.PropsWithChildren<TableHeadRowProps>) => {
  return (
    <tr
      style={{ '--table-grid-columns': gridColumns }}
      className={`grid w-full grid-cols-[--table-grid-columns] border-b-2 border-gray-200`}
    >
      {children}
    </tr>
  );
};

interface TableHeadProps<TData> {
  table: Table<TData>;
  gridColumns?: string;
}
export function TableHead<T>({ table, gridColumns = '30% 15% 1fr 1fr 10%' }: TableHeadProps<T>) {
  return (
    <thead className="grid">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableHeadRow key={headerGroup.id} gridColumns={gridColumns}>
          {headerGroup.headers.map((header) => (
            <TableHeadCell<T> key={header.id} header={header} />
          ))}
        </TableHeadRow>
      ))}
    </thead>
  );
}
