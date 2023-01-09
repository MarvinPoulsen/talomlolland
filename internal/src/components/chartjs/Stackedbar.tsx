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
export interface StackedDataSeries{
  name: string;
  values: number[];
  stack: string;
};
interface StackedbarProps {
  title?: string;
  categories: string[];
  dataSeries: StackedDataSeries[];
  bgColorsStart: number;
  legendPosition?: string;
  omittedFromSum?: string;
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

export function Stackedbar(props: StackedbarProps) {
  // console.log('StackedbarProps: ',props)
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
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display:  props.legendPosition ? true : false,
        position: props.legendPosition as 'chartArea',
      },
      tooltip: {
          yAlign:'bottom' as 'bottom',
          titleAlign: 'center' as 'center',
          callbacks: {
            footer: (items)=> {
              const toSum = items.filter(
                (row) => row.dataset.label !== props.omittedFromSum
              );
              const footerContent = `Total: ${props.omittedFromSum ? toPrettyNumber(toSum.reduce((a, b) => a + b.parsed.y, 0)) : toPrettyNumber(items.reduce((a, b) => a + b.parsed.y, 0))}`;
              return footerContent
            }
              }
          },
      title: {
        display:  props.title ? true : false,
        text: props.title,
      },
    },
  };
  // DATA
  const datasets: StackedDatasets[] = [];
  for (let i = 0; i < props.dataSeries.length; i++) {
    const dataset = {
      label: props.dataSeries[i].name,
      data: props.dataSeries[i].values,
      backgroundColor: colors.bgColors[i + props.bgColorsStart],
      stack: props.dataSeries[i].stack,
    };
    datasets.push(dataset);
  }
  const data: StackedBarData = {
    labels: props.categories,
    datasets,
  };

  return <Bar options={options} data={data} />;
}
export default Stackedbar;
