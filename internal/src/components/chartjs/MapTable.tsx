import React from 'react';
import { toPrettyNumber, getBackgroundColor, getBorderColor } from '../../../utils';
import { useTable, Column } from 'react-table';
import './legendTable.scss';

export interface LegendTableData {
    name: string;
    values: number[];
    on: boolean;
}
interface LegendTableProps {
    colorsStart?: number;
    headers: string[];
    data: LegendTableData[];
    onRowToggle: (rowIndex: number) => void;
    abbreviation?: string[] | undefined;
    date?: string;
    categories?: Category[];
    selectedColumn: string;
}

export interface Category {
    name: string;
    index: number;
}

const createTableData = (data: LegendTableData[], headers: string[], categories?: Category[]) => {
    const tableData: object[] = [];
    const tableColumns: Column<object>[] = [];
    let categoryColumns: Column<object>[] = [];
    for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        categoryColumns.push({
            Header: header,
            accessor: 'col' + (i + 1).toString(),
            Footer:
                i === 0
                    ? 'I alt'
                    : toPrettyNumber(data.filter((item) => item.on).reduce((sum, current) => sum + current.values[i - 1], 0)),
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
                accessor: 'col' + (i + 1).toString(),
                Footer:
                    i === 0
                        ? 'I alt'
                        : toPrettyNumber(
                              data.filter((item) => item.on).reduce((sum, current) => sum + current.values[i - 1], 0)
                          ),
            });
        }
    }
    data.forEach((element) => {
        let row: { [key: string]: string } = { col1: element.name };
        for (let i = 1; i < headers.length; i++) {
            const accessor = 'col' + (i + 1).toString();
            row[accessor] = toPrettyNumber(element.values[i - 1]);
        }
        tableData.push(row);
    });
    return [tableData, tableColumns];
};

function MapTable(props: LegendTableProps) {
    // console.log('MapTableProps: ', props)
    const [data, columns] = React.useMemo(
        () => createTableData(props.data, props.headers, props.categories),
        [props.data, props.headers, props.categories]
    );
    const { getTableProps, getTableBodyProps, headerGroups, footerGroups, rows, prepareRow } = useTable({
        columns: columns as Column<object>[],
        data,
    });

    return (
        <table
            {...getTableProps({
                className: 'table is-bordered is-hoverable is-size-7 is-fullwidth is-narrow',
            })}
        >
            {props.date ? <caption>Tabellen viser data for {props.date}</caption> : ''}
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (                            
                            <th {...column.getHeaderProps({ className: column.Header === props.selectedColumn ? ' is-selected' : '' })}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    const isOff = !props.data[row.index].on;
                    const background = props.colorsStart ? getBackgroundColor(props.colorsStart) : getBackgroundColor(0);
                    const borderColor = props.colorsStart ? getBorderColor(props.colorsStart) : getBorderColor(0);
                    return (
                        <tr {...row.getRowProps()} onClick={() => props.onRowToggle(row.index)}>
                            {row.cells.map((cell) => {
                                const isNumber = isNaN(cell.value.replace('.', '')) ? '' : ' has-text-right';
                                const isSelected = cell.column.Header === props.selectedColumn ? ' is-selected' : '';
                                return (
                                    <td {...cell.getCellProps({ className: ' content' + (isOff ? ' is-off' : '') + isNumber + isSelected})}>
                                        {cell.column.id === 'col1' && (
                                            <span
                                                className="color-box"
                                                style={{
                                                    background: background[row.index],
                                                    borderColor: borderColor[row.index],
                                                }}
                                            ></span>
                                        )}
                                        {cell.render('Cell')}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
            {!props.categories && (
                <tfoot>
                    {footerGroups.map((group) => (
                        <tr {...group.getFooterGroupProps()}>
                            {group.headers.map((column) => {
                                            // @ts-ignore
                                const isNumber = isNaN(column.Footer.replace('.', '')) ? '' : ' has-text-right';
                                const isSelected = column.Header === props.selectedColumn ? ' is-selected' : '';
                                return (
                                <th
                                    {...column.getFooterProps({
                                        className: isNumber + isSelected
                                    })}
                                >
                                    {column.render('Footer')}
                                </th>
                            )})}
                        </tr>
                    ))}
                </tfoot>
            )}
        </table>
    );
}

export default MapTable;
