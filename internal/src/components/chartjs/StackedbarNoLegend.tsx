import React, { useRef, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { BubbleDataPoint, InteractionMode, ScatterDataPoint } from 'chart.js';
import colors from '../../../colors';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { toPrettyNumber } from '../../../utils';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
export interface StackedDataSeries {
    name: string;
    values: number[];
    stack: string;
}
interface StackedbarProps {
    title?: string;
    categories: string[];
    dataSeries: StackedDataSeries[];
    bgColorsStart?: number;
    legendPosition?: string;
    visibility: boolean[];
}
interface StackedDatasets {
    label: string;
    data: number[];
    stack: string;
    backgroundColor: string;
}
interface StackedBarData {
    labels: string[];
    datasets: StackedDatasets[];
}

export function StackedbarNoLegend(props: StackedbarProps) {
    const chartRef = useRef<ChartJSOrUndefined<'bar', (number | ScatterDataPoint | BubbleDataPoint | null)[], unknown>>();

    useEffect(() => {
        if (chartRef.current) {
            for (let i = 0; i < props.visibility.length; i++) {
                chartRef.current.setDatasetVisibility(i, props.visibility[i]);
            }
            chartRef.current.update();
        }
    }, [props.visibility]);

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        interaction: {
            intersect: false,
            mode: 'index' as InteractionMode,
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    padding: 0,
                },
            },
            y: {
                display: false,
                stacked: true,
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                display: props.legendPosition ? true : false,
                position: props.legendPosition as 'chartArea',
            },
            title: {
                display: props.title ? true : false,
                text: props.title,
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label =
                            context.dataset.label.length > 12
                                ? context.dataset.label.substring(0, 8) + '.. '
                                : context.dataset.label;
                        const tooltipContent = `${label}: ${toPrettyNumber(context.parsed.y)}`;
                        return tooltipContent;
                    },
                    footer: (items) => {
                        const footerContent = `Total: ${toPrettyNumber(items.reduce((a, b) => a + b.parsed.y, 0))}`;
                        return footerContent;
                    },
                },
            },
        },
    };
    // DATA
    const datasets: StackedDatasets[] = [];
    for (let i = 0; i < props.dataSeries.length; i++) {
        const dataset = {
            barPercentage: 1.0,
            categoryPercentage: 0.9,
            label: props.dataSeries[i].name,
            data: props.dataSeries[i].values,
            backgroundColor: props.bgColorsStart ? colors.bgColors[i + props.bgColorsStart] : colors.bgColors[i],
            stack: props.dataSeries[i].stack,
        };
        datasets.push(dataset);
    }
    const data: StackedBarData = {
        labels: props.categories,
        datasets,
    };

    return <Bar ref={chartRef} options={options} data={data} />;
}
export default StackedbarNoLegend;
