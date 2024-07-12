import React from 'react';
import { useTable, Column } from 'react-table';
import './legendTable.scss';
import { toPrettyNumber, getBackgroundColor, getBorderColor } from '../../../utils';

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
}

type MyColumn = Column<object> & { title?: string };

const createTableData = (data: LegendTableData[], headers: string[], abbreviations?: string[]) => {
    const tableData: object[] = [];
    const tableColumns: MyColumn[] = [];
    for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        const title = abbreviations && abbreviations[i] ? abbreviations[i] : header;
        tableColumns.push({
            Header: header,
            title,
            accessor: 'col' + (i + 1).toString(),
            Footer:
                i === 0
                    ? 'I alt'
                    : toPrettyNumber(data.filter((item) => item.on).reduce((sum, current) => sum + current.values[i - 1], 0)),
        });
    }
    data.forEach((element) => {
        const row: { [key: string]: string } = { col1: element.name };
        for (let i = 1; i < headers.length; i++) {
            const accessor = 'col' + (i + 1).toString();
            row[accessor] = toPrettyNumber(element.values[i - 1]);
        }
        tableData.push(row);
    });
    return [tableData, tableColumns];
};

function LegendTableMulti(props: LegendTableProps) {
    console.log('LegendTableProps: ',props)
    const [data, columns] = React.useMemo(
        () => createTableData(props.data, props.headers, props.abbreviation),
        [props.data, props.headers, props.abbreviation]
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
                        {headerGroup.headers.map((column) => {
                            console.log('column: ',column)
                            const title = column && column.render ? column.render('title') : undefined;
                            return (
                                <th {...column.getHeaderProps()}>
                                    <abbr title={title !== null && title !== undefined ? title.toString() : undefined}>
                                        {column.render('Header')}
                                    </abbr>
                                </th>
                            );
                        })}
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
                                return (
                                    <td {...cell.getCellProps({ className: ' content' + (isOff ? ' is-off' : '') + isNumber })}>
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
            <tfoot>
                {footerGroups.map((group) => (
                    <tr {...group.getFooterGroupProps()}>
                        {group.headers.map((column) => (
                            <th
                                {...column.getFooterProps({
                                    // @ts-ignore
                                    className: isNaN(column.Footer.replace('.', '')) ? '' : ' has-text-right',
                                })}
                            >
                                {column.render('Footer')}
                            </th>
                        ))}
                    </tr>
                ))}
            </tfoot>
        </table>
    );
}

export default LegendTableMulti;
