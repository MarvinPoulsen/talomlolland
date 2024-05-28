import React from 'react';
import { useTable } from 'react-table';
import { toPrettyNumber } from '../../../utils';

export interface TablesData {
    name: string;
    values: number[];
}
interface TablesProps {
    headers: string[];
    data: TablesData[];
    date?: string;
}

const createTablesData = (data, headers) => {
    const tableData: object[] = [];
    const tableColumns: object[] = [];
    for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        tableColumns.push({
            Header: header,
            title: header, // todo
            accessor: 'col' + (i + 1).toString(),
            Footer:
                i === 0
                    ? 'I alt'
                    : toPrettyNumber(data.filter((item) => item.on).reduce((sum, current) => sum + current.values[i - 1], 0)),
        });
    }
    data.forEach((element) => {
        const row = { col1: element.name };
        for (let i = 1; i < headers.length; i++) {
            const accessor = 'col' + (i + 1).toString();
            row[accessor] = toPrettyNumber(element.values[i - 1]);
        }
        tableData.push(row);
    });
    return [tableData, tableColumns];
};

function Tables(props: TablesProps) {
    const [data, columns] = React.useMemo(() => createTablesData(props.data, props.headers), [props.data, props.headers]);

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    return (
        <table
            {...getTableProps({
                className: 'table is-bordered is-hoverable is-size-7 is-fullwidth is-narrow',
            })}
        >
        {props.date ? <caption>Tabellen viser data for {props.date}</caption>:'' }
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
export default Tables;
