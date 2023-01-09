import React from 'react';
import { useTable } from 'react-table';
import { FlexHouseHistoryRow } from '../../pages/FlexHouse';

interface FlexHouseHistoryTableProps {
  data: FlexHouseHistoryRow[];
}

const createTableData = (data) => {
  const tableData: object[] = [];
  const tableColumns: object[] = [
    {
      Header: 'År',
      title: 'Årstal',
      accessor: 'col1', // accessor is the 'key' in the data
    },
    {
      Header: 'Antal',
      title: 'Antal flexboliger pr år',
      accessor: 'col2',
    },
  ];
  for (let i = 0; i < data.length; i++) {
    const tableRow = data[i];
    tableData.push({ col1: tableRow.aar, col2: tableRow.antal });
  }
  return [tableData, tableColumns];
};
function FlexHouseHistoryTable(props: FlexHouseHistoryTableProps) {
  const [data, columns] = React.useMemo(
    () => createTableData(props.data),
    [props.data]
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });
  return (
    <table
      {...getTableProps({
        className:
          'table is-bordered is-hoverable is-size-7 is-fullwidth is-narrow',
      })}
    >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>
                <abbr title={column.render('title')}>
                {column.render('Header')}
                </abbr>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td {...cell.getCellProps({ className: ' content' })}>
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default FlexHouseHistoryTable;
