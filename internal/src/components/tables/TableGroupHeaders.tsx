import React from 'react';
import { useTable } from 'react-table'


 function TableGroupHeaders() {
    const data = React.useMemo(
        () => [
          {
            firstName: "sail",
            lastName: "hat",
            age: 4,
            visits: 5,
            progress: 27,
            status: "complicated",
            // subRows: undefined
          },
          {
            firstName: "potato",
            lastName: "stretch",
            age: 17,
            visits: 68,
            progress: 6,
            status: "single",
            // subRows: undefined,
          },
          {
            firstName: "fire",
            lastName: "sail",
            age: 17,
            visits: 40,
            progress: 28,
            status: "complicated",
            // subRows: undefined
          },
        ],
        []
      )
const columns = React.useMemo(
  () => [
    {
      Header: ' ',
      columns: [
        {
          Header: 'Sogn',
          accessor: 'firstName',
        },
      ],
    },
    {
      Header: 'Mænd',
      columns: [
        {
          Header: '0-5 år',
          accessor: 'age',
        },
        {
          Header: '6-17 år',
          accessor: 'visits',
        },
        {
          Header: '18-64 år',
          accessor: 'status',
        },
        // {
        //   Header: '65-80 år',
        //   accessor: 'progress',
        // },
        // {
        //   Header: '+80 år',
        //   accessor: 'visits',
        // },
        // {
        //   Header: 'I alt',
        //   accessor: 'visits',
        // },
      ],
    },
    {
      Header: 'Kvinder',
      columns: [
        // {
        //   Header: 'Age',
        //   accessor: 'age',
        // },
        // {
        //   Header: 'Visits',
        //   accessor: 'visits',
        // },
        // {
        //   Header: 'Status',
        //   accessor: 'status',
        // },
        {
          Header: 'Profile Progress',
          accessor: 'progress',
        },
      ],
    },
    {
      Header: ' ', //SUM
      columns: [
        {
          Header: 'SUM',
          accessor: 'lastname',
        },
      ],
    },
  ],
  []
)

 

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })
 
   return (
    <table {...getTableProps({
      className:
        'table is-bordered is-hoverable is-size-7 is-fullwidth is-narrow',
    })}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
 }
 export default TableGroupHeaders