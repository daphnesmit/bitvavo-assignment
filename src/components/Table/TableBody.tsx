import { Cell, flexRender, Table } from '@tanstack/react-table';
import { useWindowVirtualizer, VirtualItem } from '@tanstack/react-virtual';

interface TableBodyCellProps<T> {
  cell: Cell<T, unknown>;
}

function TableBodyCell<T>({ cell }: React.PropsWithChildren<TableBodyCellProps<T>>) {
  return (
    <td className={`flex px-4 py-5`}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
}
interface TableBodyRowProps {
  rowRef: React.Ref<HTMLTableRowElement>;
  item: VirtualItem;
  scrollMargin: number;
  gridColumns: string;
}

const TableBodyRow = ({
  children,
  rowRef,
  item,
  gridColumns,
  scrollMargin,
}: React.PropsWithChildren<TableBodyRowProps>) => {
  return (
    <tr
      data-index={item.index}
      ref={rowRef}
      style={{
        '--table-grid-columns': gridColumns,
        transform: `translateY(${item.start - scrollMargin}px)`,
      }}
      className={`absolute grid w-full grid-cols-[--table-grid-columns] border-b border-gray-200`}
    >
      {children}
    </tr>
  );
};

interface TableBodyProps<T> {
  tableRef: React.RefObject<HTMLTableElement>;
  table: Table<T>;
  gridColumns?: string;
}

export function TableBody<T>({
  table,
  tableRef,
  gridColumns = '30% 15% 1fr 1fr 10%',
}: TableBodyProps<T>) {
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
        const row = rows[item.index];
        return (
          <TableBodyRow
            key={row.id}
            scrollMargin={virtualizer.options.scrollMargin}
            rowRef={(node) => virtualizer.measureElement(node)}
            item={item}
            gridColumns={gridColumns}
          >
            {row.getVisibleCells().map((cell) => {
              return <TableBodyCell key={cell.id} cell={cell} />;
            })}
          </TableBodyRow>
        );
      })}
    </tbody>
  );
}
