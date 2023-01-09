import React from 'react';
import {toPrettyNumber} from '../../../utils'
import colors from '../../../colors';
import { Line } from 'react-chartjs-2';
import { InteractionMode } from 'chart.js';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
export interface LinechartDataSeries {
    name: string;
    values: number[];
}
interface LinechartProps {
    title?: string;
    categories: string[];
    dataSeries: LinechartDataSeries[];
    fill?: boolean;
    borderColorStart: number;
    tension?: number;
}
interface LinechartDatasets {
    label: string;
    data: number[];
    fill: boolean;
    borderColor: string;
    tension: number;
}
interface LinechartData {
    labels: string[];
    datasets: LinechartDatasets[];
}

export function Linechart(props: LinechartProps) {
    const options = {
        maintainAspectRatio: false,
        responsive: true,
        interaction: {
            intersect: false,
            mode: 'dataset' as InteractionMode,
        },
        scales: {
            y: {
                title: {
                    display: props.title ? true : false,
                    text: props.title,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                // yAlign: 'bottom' as 'bottom',
                titleAlign: 'center' as 'center',
                callbacks: {
                    afterTitle: () => {
                        return 'Seneste måneder';
                    },
                    label: (context) => {
                        const max = props.categories.length - 6;
                        if (context.dataIndex > max) {
                            const tooltipContent = `${context.label}: ${toPrettyNumber(context.raw)}`;
                            return tooltipContent;
                        } else {
                            return '';
                        }
                    },
                },
            },
        },
    };
    // DATA
    const datasets: LinechartDatasets[] = [];
    for (let i = 0; i < props.dataSeries.length; i++) {
        const dataset = {
            label: props.dataSeries[i].name,
            data: props.dataSeries[i].values,
            fill: props.fill ? true : false,
            borderColor: colors.borderColors[i + props.borderColorStart],
            tension: props.tension ? props.tension : 0.4,
        };
        datasets.push(dataset);
    }
    const data: LinechartData = {
        labels: props.categories,
        datasets,
    };
    return <Line options={options} data={data} />;
}
export default Linechart;
