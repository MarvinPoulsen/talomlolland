import React from 'react';
import { useTable } from 'react-table';
import { SummerhouseRow } from '../../pages/SummerHouse';
import './summerhouseCountTable.scss';

interface TableProps {
    data: SummerhouseRow[];
}

let beboedeCount = { col1: 'Beboede sommerhuse' };
let ubeboedeCount = { col1: 'Ubeboede sommerhuse' };
let tommeSommerhusgrundeCount = { col1: 'Tomme grunde' };

const createTableData = (data) => {
    const tableData: object[] = [];
    const tableColumns: object[] = [];
    tableColumns.push({ Header: '', accessor: 'col1' });
    for (let i = 0; i < data.length; i++) {
        const tableRow = data[i];
        const tabelColumn = 'col' + (i + 2);
        beboedeCount[tabelColumn] = tableRow.beboede_count;
        ubeboedeCount[tabelColumn] = tableRow.ubeboede_count;
        tommeSommerhusgrundeCount[tabelColumn] = tableRow.tomme_sommerhusgrunde_count;
        tableColumns.push({ Header: tableRow.navn, accessor: tabelColumn });
    }
    tableData.push(beboedeCount);
    tableData.push(ubeboedeCount);
    tableData.push(tommeSommerhusgrundeCount);
    return [tableData, tableColumns];
};
function MyTable(props: TableProps) {
    const [data, columns] = React.useMemo(() => createTableData(props.data), [props.data]);

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });
    return (
        <table {...getTableProps({ className: 'table is-bordered is-hoverable is-size-7 is-fullwidth is-narrow' })}>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps({ className: 'th-lodret' })}>{column.render('Header')}</th>
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
                                const isNumber = isNaN(cell.value) ? '' : ' has-text-right';
                                return (
                                    <td {...cell.getCellProps({ className: ' content' + isNumber })}>{cell.render('Cell')}</td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
export default MyTable;
