import React, { FC } from 'react';
// import { Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { SummerhouseOwnerRow } from '../../pages/SummerHouse';
import { SummerhouseRow } from '../../pages/SummerHouse';
import { Bar } from 'react-chartjs-2';
// import { Bar } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
interface SummerhouseOwnerBarchartProps {
  data: SummerhouseOwnerRow[];
  onHover: (omraade?: SummerhouseRow) => void;
  onClick: (omraade?: SummerhouseRow) => void;
}
const SummerhouseOwnerBarchart: FC = (props: SummerhouseOwnerBarchartProps) => {
  const labels: string[] = props.data.map((item) => item.region);

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  const data = {
    labels,
    datasets: [
      {
        label: 'Antal',
        data: props.data.map((item) => item.count),
        borderWidth: 1,
        backgroundColor: [
          'rgba(51, 255, 51, 0.2)',
          'rgba(255, 255, 102, 0.2)',
          'rgba(255, 0, 0, 0.2)',
          'rgba(51, 153, 255, 0.2)',
          'rgba(255, 102, 0, 0.2)',
          'rgba(10, 10, 10, 0.2)',
          'rgba(90, 90, 90, 0.2)',
        ],
        borderColor: [
          'rgba(51, 255, 51, 1)',
          'rgba(255, 255, 102, 1)',
          'rgba(255, 0, 0, 1)',
          'rgba(51, 153, 255, 1)',
          'rgba(255, 102, 0, 1)',
          'rgba(10, 10, 10, 1)',
          'rgba(90, 90, 90, 1)',
        ],
      },
    ],
  };
  return <Bar options={options} data={data} />;
};
export default SummerhouseOwnerBarchart;
