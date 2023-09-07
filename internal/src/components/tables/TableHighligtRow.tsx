import React from 'react';
import { toPrettyNumber } from '../../../utils';
import { useTable } from 'react-table';
import './tableHighligtRow.scss';

export interface TableHighligtRowData {
    name: string;
    malePreschool: number;
    maleSchooler: number;
    maleAdult: number;
    maleSenior: number;
    maleOld: number;
    male: number;
    femalePreschool: number;
    femaleSchooler: number;
    femaleAdult: number;
    femaleSenior: number;
    femaleOld: number;
    female: number;
    bothGenders: number;
}
interface TableHighligtRowProps {
    headers: string[];
    categories?: object[];
    selectedRow: string;
    data: TableHighligtRowData[];
}

const createTableData = (data, headers, categories) => {
    const tableData: object[] = [];
    const tableColumns: object[] = [];
    let categoryColumns: object[] = [];
    for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        categoryColumns.push({
            Header: header,
            title: header, // todo
            accessor: 'col' + (i + 1).toString(),
        });
        if (categories) {
            const category = categories.find((item) => item.index === i);
            if (category) {
                tableColumns.push({
                    Header: category.name,
                    columns: categoryColumns,
                });
                categoryColumns = [];
            }
        } else {
            tableColumns.push({
                Header: header,
                title: header, // todo
                accessor: 'col' + (i + 1).toString(),
            });
        }
    }
    for (let i = 0; i < data.length; i++) {
        const tableRow = data[i];
        tableData.push({
            col1: tableRow.name,
            col2: toPrettyNumber(tableRow.malePreschool),
            col3: toPrettyNumber(tableRow.maleSchooler),
            col4: toPrettyNumber(tableRow.maleAdult),
            col5: toPrettyNumber(tableRow.maleSenior),
            col6: toPrettyNumber(tableRow.maleOld),
            col7: toPrettyNumber(tableRow.male),
            col8: toPrettyNumber(tableRow.femalePreschool),
            col9: toPrettyNumber(tableRow.femaleSchooler),
            col10: toPrettyNumber(tableRow.femaleAdult),
            col11: toPrettyNumber(tableRow.femaleSenior),
            col12: toPrettyNumber(tableRow.femaleOld),
            col13: toPrettyNumber(tableRow.female),
            col14: toPrettyNumber(tableRow.bothGenders),
        });
    }
    // adding sum row to table
    tableData.push({
        col1: 'I alt',
        col2: toPrettyNumber(data.reduce((sum, current) => sum + current.malePreschool, 0)),
        col3: toPrettyNumber(data.reduce((sum, current) => sum + current.maleSchooler, 0)),
        col4: toPrettyNumber(data.reduce((sum, current) => sum + current.maleAdult, 0)),
        col5: toPrettyNumber(data.reduce((sum, current) => sum + current.maleSenior, 0)),
        col6: toPrettyNumber(data.reduce((sum, current) => sum + current.maleOld, 0)),
        col7: toPrettyNumber(data.reduce((sum, current) => sum + current.male, 0)),
        col8: toPrettyNumber(data.reduce((sum, current) => sum + current.femalePreschool, 0)),
        col9: toPrettyNumber(data.reduce((sum, current) => sum + current.femaleSchooler, 0)),
        col10: toPrettyNumber(data.reduce((sum, current) => sum + current.femaleAdult, 0)),
        col11: toPrettyNumber(data.reduce((sum, current) => sum + current.femaleSenior, 0)),
        col12: toPrettyNumber(data.reduce((sum, current) => sum + current.femaleOld, 0)),
        col13: toPrettyNumber(data.reduce((sum, current) => sum + current.female, 0)),
        col14: toPrettyNumber(data.reduce((sum, current) => sum + current.bothGenders, 0)),
    });
    return [tableData, tableColumns];
};

function TableHighligtRow(props: TableHighligtRowProps) {
    const [data, columns] = React.useMemo(
        () => createTableData(props.data, props.headers, props.categories),
        [props.data, props.headers, props.categories]
    );

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
                        <tr {...row.getRowProps({ className: row.values.col1 === props.selectedRow ? 'is-selected' : '' })}>
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

export default TableHighligtRow;
