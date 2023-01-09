import React, { FC } from 'react';
import { Bar } from 'react-chartjs-2';
// import Data from './Data';
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

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true
    }
  }
};

// console.log(Data);
const labels: string[] = ['Nov 2021', 'Dec 2021', 'Jan 2022', 'Feb 2022','Mar 2022'];
const datasetsLabel: string[] = ['Dataset 1', 'Dataset 2'];
const datasetsData: number[][] = [[40175, 40115, 40102, 40061, 39988],[3998, 4011, 4010, 4006, 9988]];
const datasetsBgColor: string[] = ['rgba(255, 99, 132, 0.5)','rgba(55, 99, 132, 0.5)'];

export const data = {
  labels,
  datasets: [
    {
      label: datasetsLabel[0],
      data: datasetsData[0],
      backgroundColor: datasetsBgColor[0],
    },
    {
      label: datasetsLabel[1],
      data: datasetsData[1],
      backgroundColor: datasetsBgColor[1]
    }
  ]
};




const Graph: FC = () => {
    return <Bar options={options} data={data} />;
}
export default Graph