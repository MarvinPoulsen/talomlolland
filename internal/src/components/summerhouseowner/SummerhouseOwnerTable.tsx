import React from 'react';
import { useTable } from 'react-table';
import { SummerhouseOwnerRow } from '../../pages/SummerHouse';
import { toPrettyNumber } from '../../../utils';

interface SummerhouseResidenceTableProps {
    data: SummerhouseOwnerRow[];
}

const createTableData = (data) => {
    const tableData: object[] = [];
    const tableColumns: object[] = [
        {
            Header: 'Region',
            accessor: 'col1', // accessor is the 'key' in the data
        },
        {
            Header: 'Antal',
            accessor: 'col2',
        },
    ];
    for (let i = 0; i < data.length; i++) {
        const tableRow = data[i];
        tableData.push({ col1: tableRow.region, col2: toPrettyNumber(tableRow.count) });
    }
    return [tableData, tableColumns];
};
function SummerhouseResidenceTable(props: SummerhouseResidenceTableProps) {
    const [data, columns] = React.useMemo(() => createTableData(props.data), [props.data]);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });
    return (
        <table
            {...getTableProps({
                className: 'table is-bordered is-hoverable is-size-7 is-fullwidth is-narrow',
            })}
        >
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
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
                                console.log('cell: ',cell)
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

export default SummerhouseResidenceTable;
