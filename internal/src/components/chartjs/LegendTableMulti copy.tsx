import React from 'react';
import { useTable } from 'react-table';
import './legendTable.scss'
import {toPrettyNumber, getBackgroundColor, getBorderColor} from '../../../utils'

export interface LegendTableData {
  name:string;
  values: number[];
  on: boolean;
}
interface LegendTableProps {
  categories?: object[];
  colorsStart?: number;
  headers: string[];
  data: LegendTableData[];
  onRowToggle: (rowIndex:number) => void;
}

const createTableData = (data, headers ,categories) => {
  const tableData: object[] = [];
  const tableColumns: object[] = [];
  let categoryColumns: object[] = [];
  for (let i = 0; i < headers.length; i++){
    const header = headers[i];
    categoryColumns.push({ 
        Header: header,
        title: header, // todo 
        accessor: 'col'+(i+1).toString(),
        // Footer:'',
        Footer: i===0 ? 'I alt': toPrettyNumber(data.filter(item=>item.on).reduce((sum, current) => sum + current.values[i-1] ? current.values[i-1] : 0, 0) )
        
    })
    if (categories){
      const category = categories.find(
          (item) => item.index === i
      )
      if(category){
        tableColumns.push({ 
          Header: category.name,
          columns: categoryColumns,
          Footer: i===0 ? 'I alt': toPrettyNumber(data.filter(item=>item.on).reduce((sum, current) => sum + current.values[i-1] ? current.values[i-1] : 0, 0) )
          // Footer:'',
        })
        categoryColumns=[];
      }
    }else{
    tableColumns.push({ 
        Header: header,
        title: header, // todo 
        accessor: 'col'+(i+1).toString(),
        Footer: i===0 ? 'I alt': toPrettyNumber(data.filter(item=>item.on).reduce((sum, current) => sum + current.values[i-1], 0) )
    })
  }
  }
data.forEach(element => {
  const row = {col1: element.name};
  for (let i = 1; i < headers.length; i++){
    const accessor = 'col'+(i+1).toString();
    row[accessor] = toPrettyNumber(element.values[i-1]);
  }
  tableData.push(row)
});
console.log('tableColumns: ',tableColumns)
console.log('tableData: ',tableData)
  return [tableData, tableColumns];
};

function LegendTableMulti(props: LegendTableProps) {
  const [data, columns] = React.useMemo(
    () => createTableData(props.data, props.headers, props.categories),
    [props.data, props.headers, props.categories]
  );
  const { getTableProps, getTableBodyProps, headerGroups, footerGroups, rows, prepareRow } =
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
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          const isOff = !props.data[row.index].on
          const background = getBackgroundColor(props.colorsStart)
          const borderColor = getBorderColor(props.colorsStart)
          return (
            <tr {...row.getRowProps()} onClick={()=> props.onRowToggle(row.index)}>
              {row.cells.map((cell) => {
                return (
                  <td {...cell.getCellProps({ className: ' content' +(isOff? ' is-off':'') })}>
                    {cell.column.id === 'col1' && 
                      <span 
                        className='color-box' 
                        style={{
                          background: background[row.index],
                          borderColor: borderColor[row.index]
                        }}
                      >                        
                      </span>
                    }
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        {footerGroups.map(group => (
          <tr {...group.getFooterGroupProps()}>
            {group.headers.map(column => (
              <th {...column.getFooterProps()}>{column.render('Footer')}</th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  );
}

export default LegendTableMulti;
