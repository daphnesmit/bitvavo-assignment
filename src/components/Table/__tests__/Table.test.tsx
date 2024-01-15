import { ColumnDef } from '@tanstack/react-table';
import { fireEvent, render, screen, waitFor } from '../../../tests/testUtils';
import { Table } from '../Table';

interface MockTableData {
  name: string;
  age: number;
}
const columns: ColumnDef<MockTableData>[] = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Age', accessorKey: 'age' },
];
const data: MockTableData[] = [
  { name: 'John Doe', age: 25 },
  { name: 'Jane Smith', age: 30 },
];

describe('Table', () => {
  test('renders table with search input and table body', () => {
    render(<Table<MockTableData> columns={columns} data={data} />);

    // Assert that the table is rendered
    const tableElement = screen.getByRole('table');
    expect(tableElement).toBeInTheDocument();

    // Assert that the search input is rendered
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();

    // Assert that the table rows are rendered
    const tableRowGroup = screen.getAllByRole('rowgroup');
    expect(tableRowGroup).toHaveLength(2);
  });

  test('filters table data based on search input', async () => {
    render(<Table columns={columns} data={data} />);

    // Type 'John' into the search input
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    await waitFor(() => {
      // Assert that only the row with name 'Jane Smith' is hidden
      const hiddenRow = screen.queryByText('Jane Smith');
      expect(hiddenRow).not.toBeInTheDocument();
    });
    // Assert that only the row with name 'John Doe' is visible
    const visibleRow = screen.getByText('John Doe');
    expect(visibleRow).toBeInTheDocument();
  });
});
