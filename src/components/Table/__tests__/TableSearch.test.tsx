import { fireEvent, render, waitFor } from '../../../tests/testUtils';
import { TableSearch } from '../TableSearch';

describe('TableSearch', () => {
  it('calls the onChange function when input changes', async () => {
    const mockOnChange = jest.fn();
    const { getByRole } = render(<TableSearch onChange={mockOnChange} />);
    const input = getByRole('textbox');

    fireEvent.change(input, { target: { value: 'test' } });
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('test');
    });
  });
});
