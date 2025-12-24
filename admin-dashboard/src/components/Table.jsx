const Table = ({ columns, data }) => {
  const tableData = Array.isArray(data) ? data : [];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns.map((col) => (
              <th key={col.accessor} scope="col" className="px-6 py-3">
                {col.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, i) => (
            <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              {columns.map((col) => (
                <td key={col.accessor} className="px-6 py-4">
                  {col.Cell ? col.Cell({ value: row[col.accessor], row: { original: row } }) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
