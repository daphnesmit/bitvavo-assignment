import { DebouncedInput } from '../Input/DebouncedInput';

interface TableSearchProps {
  globalFilter?: string;
  onChange: (value: string | number) => void;
}
export function TableSearch({ globalFilter, onChange }: TableSearchProps) {
  return (
    <DebouncedInput
      value={globalFilter ?? ''}
      onChange={onChange}
      className="font-lg border-block mb-6 border p-2"
      placeholder="Search all columns..."
    />
  );
}
