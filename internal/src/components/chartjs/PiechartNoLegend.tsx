import React, { useRef, useEffect } from 'react';
import { getBackgroundColor, getBorderColor } from '../../../utils';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, InteractionMode } from 'chart.js';
import { Pie, Doughnut } from 'react-chartjs-2';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface PiechartData {
    name: string;
    value: number;
    on: boolean;
}

export interface PiechartProps {
    data: PiechartData[];
    visibility: boolean[];
    colorsStart?: number;
    type?: string;
    title?: string;
}
interface PiechartDatasets {
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
}
interface PieData {
    labels: string[];
    datasets: PiechartDatasets[];
}

export function PiechartNoLegend(props: PiechartProps) {
    const doughnutChartRef = useRef<ChartJSOrUndefined<'doughnut', number[], string>>();
    const pieChartRef = useRef<ChartJSOrUndefined<'pie', number[], string>>();
    useEffect(() => {
        const chartRef = props.type === 'doughnut' ? doughnutChartRef.current : pieChartRef.current;
        if (chartRef) {
            for (let i = 0; i < props.visibility.length; i++) {
                if (chartRef.getDataVisibility(i) !== props.visibility[i]) {
                    chartRef.toggleDataVisibility(i);
                }
            }
            chartRef.update();
        }
    }, [props.visibility]);
    const options = {
        responsive: true,
        interaction: {
            intersect: true,
            mode: 'dataset' as InteractionMode,
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                filter: (tooltipItem) => {
                    return tooltipItem.chart.getDataVisibility(tooltipItem.dataIndex);
                },
                yAlign: 'bottom' as 'bottom',
                titleAlign: 'center' as 'center',
                callbacks: {
                    label: (context) => {
                        // console.log('context: ',context)
                        let totalSum = 0;
                        for (let i = 0; i < context.dataset.data.length; i++) {
                            const on = context.chart.getDataVisibility(i);
                            totalSum += on ? context.dataset.data[i] : 0;
                        }
                        const label = context.label.length > 15 ? context.label.substring(0, 11) + '.. ' : context.label;
                        const tooltipContent = `${label}: ${((context.parsed / totalSum) * 100).toFixed(1)}%`;
                        return tooltipContent;
                    },
                },
            },
            title: {
                display: props.title ? true : false,
                text: props.title ? props.title : 'title',
            },
        },
    };
    const datasets: PiechartDatasets[] = [
        {
            data: props.data.map((row) => row.value),
            backgroundColor: getBackgroundColor(props.colorsStart),
            borderColor: getBorderColor(props.colorsStart),
            borderWidth: 1,
        },
    ];
    const data: PieData = {
        labels: props.data.map((row) => row.name),
        datasets,
    };
    const chartForm =
        props.type === 'doughnut' ? (
            <Doughnut ref={doughnutChartRef} options={options} data={data} />
        ) : (
            <Pie ref={pieChartRef} options={options} data={data} />
        );
    return <>{chartForm}</>;
}

export default PiechartNoLegend;
