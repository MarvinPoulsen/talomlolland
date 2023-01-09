import React, { FC } from 'react';
import { FlexHouseHistoryRow } from '../../pages/FlexHouse';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
// import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);


interface FlexHouseHistoryChartProps {
  data: FlexHouseHistoryRow[];
}
const FlexHouseHistoryChart: FC = (props: FlexHouseHistoryChartProps) => {
  const labels = props.data.map((item) => item.aar);

  const options = {
    maintainAspectRatio: false,
    responsive: true,
        scales: {
          y: {
            min: 0,
          },
        },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
        text: 'Antal flexboligtilladelser pr. år',
      },
    },
  };
  const data = {
    labels,
    datasets: [
      {
        label: 'Antal flexboligtilladelser pr. år',
        data: props.data.map((item) => item.antal),
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };
    return <Line 
      options={options} 
      data={data} 
    />;
  };
  export default FlexHouseHistoryChart;
