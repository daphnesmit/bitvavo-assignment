import { flexRender, Row, Table } from '@tanstack/react-table';
import { useWindowVirtualizer } from '@tanstack/react-virtual';

interface TableBodyProps<TData> {
  tableRef: React.RefObject<HTMLTableElement>;
  table: Table<TData>;
}

export function TableBody<T>({ table, tableRef }: TableBodyProps<T>) {
  const { rows } = table.getRowModel();

  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => 40, // estimate row height for accurate scrollbar dragging
    scrollMargin: tableRef.current?.offsetTop ?? 0,
    overscan: 5,
  });

  return (
    <tbody
      style={{
        height: `${virtualizer.getTotalSize()}px`,
      }}
      className="relative grid"
    >
      {virtualizer.getVirtualItems().map((item) => {
        const row = rows[item.index] as Row<unknown>;
        return (
          <tr
            data-index={item.index}
            ref={(node) => virtualizer.measureElement(node)}
            key={row.id}
            style={{
              transform: `translateY(${item.start - virtualizer.options.scrollMargin}px)`,
            }}
            className={`grid-cols-assets-table-row absolute grid w-full border-b border-gray-200`}
          >
            {row.getVisibleCells().map((cell) => {
              return (
                <td
                  key={cell.id}
                  style={{ '--column-cell-size': `${cell.column.getSize()}px` }}
                  className={`flex w-[--columns-cell-size] px-5 py-5`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
}
