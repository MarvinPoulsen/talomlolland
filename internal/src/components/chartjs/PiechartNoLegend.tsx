import React, { useRef, useEffect } from 'react';
import colors from '../../../colors';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, InteractionMode } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);
export const options = {
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
        return tooltipItem.chart.getDataVisibility(tooltipItem.dataIndex)
      },
      yAlign:'bottom' as 'bottom',
      titleAlign: 'center' as 'center',
      callbacks: {
        label: (context) => {
          let totalSum = 0;
          for (let i = 0;i<context.dataset.data.length;i++){				
            const on = context.chart.getDataVisibility(i);
            totalSum += (on ? context.dataset.data[i] : 0);
          };
          const label = context.label.length > 15 ? context.label.substring(0,11) + '.. ' : context.label;
          const tooltipContent = `${label}: ${((context.parsed/totalSum)*100).toFixed(1)}%`;
          return tooltipContent;
        }, 
      }
    },
    title: {
      display: false,
      text: 'demographySognPie',
    },

  },
};
export interface PiechartData {
  name: string;
  value: number;
  on: boolean;
}

export interface PiechartProps {
  data: PiechartData[];
  visibility: boolean[];
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
  const chartRef = useRef();
  useEffect(()=>{
    for (let i=0; i<props.visibility.length;i++){
      if (chartRef.current.getDataVisibility(i) !== props.visibility[i]){
        chartRef.current.toggleDataVisibility(i);
      }
    }
    chartRef.current.update();
  },[props.visibility])
  const datasets: PiechartDatasets[] = [
    {
      data: props.data.map(row=>row.value),
      backgroundColor: colors.bgColors,
      borderColor: colors.borderColors,
      borderWidth: 1,
    },
  ];
  const data: PieData = {
    labels: props.data.map(row=>row.name),
    datasets,
  };
  return (
    <>
      <Pie
        ref={chartRef}
        options={options} 
        data={data} 
      />
    </>
  );
}

export default PiechartNoLegend;
