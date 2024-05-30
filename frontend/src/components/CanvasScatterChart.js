import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    default: return 'black';
  }
};

const CanvasScatterChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/data_points');
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && data.length > 0) {
      const dataPoints = data.map(dataPoint => ({
        x: dataPoint.x,
        y: dataPoint.y,
        markerColor: getColorForLabel(dataPoint.labels),
      }));

      const options = {
        zoomEnabled: true,
        animationEnabled: true,
        title: {
          text: "Scatter Plot"
        },
        axisY: {
          lineThickness: 1
        },
        data: [{
          type: "scatter",
          dataPoints: dataPoints
        }]
      };

      const chart = new window.CanvasJS.Chart("chartContainer", options);
      chart.render();
    }
  }, [data, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <div id="chartContainer" style={{ height: '500px', width: '100%' }}></div>;
};

export default CanvasScatterChart;
