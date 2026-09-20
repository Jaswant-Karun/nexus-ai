"use client";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => any;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-800 bg-gray-950">
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="bg-gray-900/80 text-xs uppercase font-semibold text-gray-400 border-b border-gray-800">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3.5">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/60">
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="hover:bg-gray-900/40 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4">
                  {col.render ? col.render(item) : String(item[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
