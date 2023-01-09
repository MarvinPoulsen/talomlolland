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
import { MovingPatternsRow } from '../../pages/MovingPatterns';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import colors from '../../../colors';
import { Bar } from 'react-chartjs-2';
interface MovesInChartProps {
  data: MovingPatternsRow[];
  max: number;
  labels: string[];
}
interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
    }[];
}

const MovesInChart: FC = (props: MovesInChartProps) => {
// OPTIONS
    const options = {
        interaction: {
            mode: 'index'
        },
        scales: {
            x: {
                stacked: true
            },
            y: {
                stacked: true,
                beginAtZero: true,
                suggestedMax: props.max
            }
        },
        plugins: {
            title: {
                display: false,
                text: 'tilflyttere Chart Title'
            },
            legend: {
                display: true,
            position: 'right'
            }
        },
      };
// DATA      
    // DATASET LABEL
    const datasetLabel =  [...new Set(props.data.map(item => item.regionsnavn))];
    // DATASET DATA
    const datasets:any[] =  [];
    datasetLabel.forEach((element, index) => {
        const filteredData = props.data.filter((te)=>te.regionsnavn === element);
        
        const dataset ={
            label: element.replace('Region ',''),
            data: filteredData.map(item => parseInt(item.tilflyttere) || 0),
            backgroundColor: colors.bgColors[index]
        }
        datasets.push(dataset)
    });
    const barData: ChartData = {
        labels: props.labels,
        datasets,
    };

    return <Bar    
/* @ts-ignore */
        options={options}
        data={barData}
    />;
}
    export default MovesInChart;