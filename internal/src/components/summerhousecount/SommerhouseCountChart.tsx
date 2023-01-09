import React, { FC } from 'react';
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
import { SummerhouseRow } from '../../pages/SummerHouse';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
interface SummerhouseCountChartProps {
  data: SummerhouseRow[];
  onHover: (omraade?: SummerhouseRow) => void;
  onClick: (omraade?: SummerhouseRow) => void;
}
const SummerhouseCountChart: FC = (props: SummerhouseCountChartProps) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
        text: 'Chart.js Bar Chart',
      },
    },
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
      },
    },
    onHover: (_e, items) => {
      if (items.length > 0) {
        const omr = props.data[items[0].index];
        props.onHover(omr);
      } else {
        props.onHover();
      }
    },
    onClick: (_e, items) => {
      if (items.length > 0) {
        var omr = props.data[items[0].index];
        props.onClick(omr);
      } else {
        props.onClick();
      }
    },
  };
  const data = {
    labels: props.data.map(item => item.navn),
    datasets: [
      {
        label: 'Tomme grunde',
        data: props.data.map(item => item.tomme_sommerhusgrunde_count),
        borderWidth: 1,
        backgroundColor: 'rgba(255, 190, 0, 0.3)',
        borderColor: 'rgba(255, 190, 0, 1)',
      },
      {
        label: 'Ubeboede',
        data: props.data.map(item => item.ubeboede_count),
        borderWidth: 1,
        backgroundColor: 'rgba(180, 255, 0, 0.3)',
        borderColor: 'rgba(180, 255, 0, 1)',
      },
      {
        label: 'Beboede',
        data: props.data.map(item => item.beboede_count),
        borderWidth: 1,
        backgroundColor: 'rgba(0, 230, 255, 0.3)',
        borderColor: 'rgba(0, 230, 255, 1)',
      },
    ],
  };
  return <Bar options={options} data={data} />;
};
export default SummerhouseCountChart;
