import React, { useRef, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { InteractionMode } from 'chart.js';
import {getBackgroundColor} from '../../../utils'
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
  colorsStart?: number;
  legendPosition?: string;
  visibility: boolean[];
  horizontal?: boolean;
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

export function StackedbarNoLegend(props: StackedbarProps) {
  const chartRef = useRef();
  useEffect(()=>{
    for (let i=0; i<props.visibility.length;i++){
      chartRef.current.setDatasetVisibility(i, props.visibility[i])
    }
    chartRef.current.update();
  },[props.visibility])
  const options = {
    indexAxis: props.horizontal ? 'y' as const : 'x' as const,
    maintainAspectRatio: false,
    responsive: true,
    interaction: {
      intersect: true,
      mode: 'index' as InteractionMode,
    },
    scales: {
      x: {
        stacked: true,
        ticks:{
          padding: 0,
        },
        max: 100,
      },
      y: {
        // display: false,
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
        position: 'nearest' as 'nearest',
          // yAlign:'center' as 'center',
          // xAlign:'center' as 'center',
          // titleAlign: 'left' as 'left',
          callbacks: {
            label: (context) => {
              console.log('context: ',context.dataIndex)
              const label = context.dataset.label.length > 15 ? context.dataset.label.substring(0,11) + '.. ' : context.dataset.label;
              const value = context.dataset.data[context.dataIndex].toFixed(1);
              const tooltipContent = `${label}: ${value}%`;
              return tooltipContent;
            }, 
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
      barPercentage: 1.0,
      categoryPercentage: 0.9,
      label: props.dataSeries[i].name,
      data: props.dataSeries[i].values,
      backgroundColor: getBackgroundColor(props.colorsStart)[i],
      stack: props.dataSeries[i].stack,
    };
    datasets.push(dataset);
  }
  const data: StackedBarData = {
    labels: props.categories,
    datasets,
  };

  return <Bar 
    ref={chartRef}
    options={options} 
    data={data}
  />;
}
export default StackedbarNoLegend;
