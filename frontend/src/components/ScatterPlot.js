import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement
);


const getColorForLabel = (label) => {
  switch (label) {
    case 0: return 'violet';
    case 1: return 'indigo';
    case 2: return 'blue';
    case 3: return 'green';
    case 4: return 'yellow';
    case 5: return 'orange';
    case 6: return 'red';
    case 7: return 'brown';
    default: return 'black'; // default color if label is out of range
  }
};

const downsampleData = (data, sampleSize) => {
  // downsampling logic: take every nth data point
  const downsampled = [];
  for (let i = 0; i < data.length; i += sampleSize) {
    downsampled.push(data[i]);
  }
  return downsampled;
};

const UmapScatterChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downsampledData, setDownsampledData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/data_points');
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const downsampled = downsampleData(data, 10); 
      setDownsampledData(downsampled);
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const chartData = {
    datasets: downsampledData.map(dataPoint => ({
      label: `Label ${dataPoint.labels}`,
      data: [{ x: dataPoint.x, y: dataPoint.y }],
      backgroundColor: getColorForLabel(dataPoint.labels),
      borderColor: getColorForLabel(dataPoint.labels),
      pointRadius: 1,
      pointHoverRadius: 4
    }))
  };

  const options = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'UMAP 1'
        }
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'UMAP 2'
        }
      }
    },
    plugins: {
      legend: {
        display: false 
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const dataPoint = downsampledData[context.dataIndex];
            return `Barcode: ${dataPoint.barcode}`;
          }
        }
      }
    }
  }

  return (
    <div>
      <Scatter data={chartData} options={options} />
    </div>
  );
};

export default UmapScatterChart;

