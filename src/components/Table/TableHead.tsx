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
          className={`grid-cols-assets-table-row grid w-full border-b-2 border-gray-200`}
        >
          {headerGroup.headers.map((header) => {
            return (
              <th
                style={{ '--header-cell-size': `${header.getSize()}px` }}
                className={`flex w-[--header-cell-size] px-5 py-5`}
                key={header.id}
              >
                <div
                  role="button"
                  className={`flex w-full justify-between ${
                    header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                  }`}
                  onClick={header.column.getToggleSortingHandler()}
                  onKeyDown={
                    header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined
                  }
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
