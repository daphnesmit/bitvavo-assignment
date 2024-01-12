import { flexRender, Table } from '@tanstack/react-table';

interface TableHeadProps<TData> {
  table: Table<TData>;
}

export function TableHead<T>({ table }: TableHeadProps<T>) {
  return (
    <thead className="grid">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr
          key={headerGroup.id}
          className={`grid w-full grid-cols-assets-table-row border-b-2 border-gray-200`}
        >
          {headerGroup.headers.map((header) => {
            return (
              <th className={`flex`} key={header.id}>
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
          })}
        </tr>
      ))}
    </thead>
  );
}
