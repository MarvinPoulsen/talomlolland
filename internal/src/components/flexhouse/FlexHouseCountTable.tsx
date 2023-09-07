import React from 'react';
import { useTable } from 'react-table';
import { FlexHouseRow } from '../../pages/FlexHouse';

interface FlexHouseCountTableProps {
    data: FlexHouseRow[];
}

const createTableData = (data) => {
    const tableData: object[] = [];
    const tableColumns: object[] = [
        {
            Header: 'Områder',
            title: 'Flexbolig område',
            accessor: 'col1', // accessor is the 'key' in the data
            Footer: 'Felxboliger i alt',
        },
        {
            Header: 'Antal',
            title: 'Antal flexboliger inden for området',
            accessor: 'col2',
            Footer: data.map((item) => parseInt(item.antal)).reduce((sum, current) => sum + current, 0),
        },
    ];
    for (let i = 0; i < data.length; i++) {
        const tableRow = data[i];
        tableData.push({ col1: tableRow.navn, col2: tableRow.antal });
    }
    return [tableData, tableColumns];
};
function FlexHouseCountTable(props: FlexHouseCountTableProps) {
    const [data, columns] = React.useMemo(() => createTableData(props.data), [props.data]);
    const { getTableProps, getTableBodyProps, headerGroups, footerGroups, rows, prepareRow } = useTable({ columns, data });
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
                            <th {...column.getHeaderProps()}>
                                <abbr title={column.render('title')}>{column.render('Header')}</abbr>
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
                                const isNumber = isNaN(cell.value) ? '' : ' has-text-right';
                                return (
                                    <td {...cell.getCellProps({ className: ' content' + isNumber })}>{cell.render('Cell')}</td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
            <tfoot>
                {footerGroups.map((group) => (
                    <tr {...group.getFooterGroupProps()}>
                        {group.headers.map((column) => (
                            <th {...column.getFooterProps({ className: isNaN(column.Footer) ? '' : ' has-text-right' })}>
                                {column.render('Footer')}
                            </th>
                        ))}
                    </tr>
                ))}
            </tfoot>
        </table>
    );
}

export default FlexHouseCountTable;
