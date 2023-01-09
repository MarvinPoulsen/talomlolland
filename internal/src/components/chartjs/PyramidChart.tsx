import React from 'react';
import {toPrettyNumber} from '../../../utils'
import colors from '../../../colors';
import { Bar } from 'react-chartjs-2';
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
export interface PyramidDataSeries{
  name: string;
  values: number[];
};
interface PyramidChartProps {
  title?: string;
  categories: string[];
  dataSeries: PyramidDataSeries[];
  bgColorsStart: number;
} 
interface PyramidBarDatasets {
  label: string;
  data: number[];
  backgroundColor: string;
}
interface PyramidBarData {
  labels: string[];
  datasets: PyramidBarDatasets[];
}
export const options = {
    maintainAspectRatio: false,
    responsive: true,
    interaction: {
      intersect: true,
      mode: 'index' as InteractionMode,
    },
    indexAxis: 'y' as const,
  plugins: {
    legend: {
        display: false,
    },
    tooltip: {
        yAlign:'bottom' as 'bottom',
        titleAlign: 'center' as 'center',
        callbacks: {
            label: function(context){
                return `${context.dataset.label} ${toPrettyNumber(Math.abs(context.raw))}`
                }
            }
        }
  },
  scales: {
    x: {
        stacked: true,
        ticks:{
            callback:function(value, index, values){
                return toPrettyNumber(Math.abs(value));
            }
        }
    },
    y: {
        stacked: true,
        beginAtZero: true
    }
  }
};
export function PyramidChart(props: PyramidChartProps) {
 
  // DATA
  const datasets: PyramidBarDatasets[] = [];
  for (let i = 0; i < props.dataSeries.length; i++) {
    const dataset = {
      label: props.dataSeries[i].name,
      data: props.dataSeries[i].values,
      backgroundColor: colors.bgColors[i + props.bgColorsStart],
			barPercentage: 1,
			categoryPercentage: 1,
    };
    datasets.push(dataset);
  }
  const data: PyramidBarData = {
    labels: props.categories,
    datasets,
  };
    return <Bar options={options} data={data} />;
}
export default PyramidChart;