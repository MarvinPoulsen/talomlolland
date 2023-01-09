import React from 'react';
import { useTable } from 'react-table'

export interface TableData {
  name: string;
  value: number;
}
interface TableProps {
  headers: string[];
  data: TableData[];
}

   const createTableData = (data, headers) => {
    const tableData: object[] = [];
    const tableColumns: object[] = [];
    for (let i = 0; i < headers.length; i++){
      const header = headers[i];
      tableColumns.push({ 
          Header: header,
          title: header, // todo 
          accessor: 'col'+(i+1).toString(),
          Footer: i===0 ? 'I alt': data.filter(item=>item.on).reduce((sum, current) => sum + current.value, 0) 
      })
    }
    for (let i = 0; i < data.length; i++) {
      const tableRow = data[i];
      tableData.push({ col1: tableRow.name, col2: tableRow.value });
    }
  
    return [tableData, tableColumns];
  };
  
  function Table(props: TableProps) {
    // console.log('TableProps: ',props)
    const [data, columns] = React.useMemo(
      () => createTableData(props.data, props.headers),
      [props.data, props.headers]
    );

   const {
     getTableProps,
     getTableBodyProps,
     headerGroups,
     rows,
     prepareRow,
   } = useTable({ columns, data })
 
   return (
     <table {...getTableProps({
        className:
        'table is-bordered is-hoverable is-size-7 is-fullwidth is-narrow',
      })}
     >
       <thead>
         {headerGroups.map(headerGroup => (
           <tr {...headerGroup.getHeaderGroupProps()}>
             {headerGroup.headers.map(column => (
               <th
                 {...column.getHeaderProps()}
               >
                 {column.render('Header')}
               </th>
             ))}
           </tr>
         ))}
       </thead>
       <tbody {...getTableBodyProps()}>
         {rows.map(row => {
           prepareRow(row)
           return (
             <tr {...row.getRowProps()}>
               {row.cells.map(cell => {
                 return (
                   <td
                     {...cell.getCellProps()}
                   >
                     {cell.render('Cell')}
                   </td>
                 )
               })}
             </tr>
           )
         })}
       </tbody>
     </table>
   )
 }
 export default Table