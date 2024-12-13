import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Scatter, Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import { Button } from "antd";

const Visualization = () => {
  const location = useLocation();
  const history = useHistory();
  const { data, columns } = location.state || {}; // Access data and columns passed via state
  const [plotType, setPlotType] = useState("scatter"); // Default plot type
  const [plotData, setPlotData] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  useEffect(() => {
    if (data && columns) {
      const dataSize = data.length;
      if (dataSize < 50) {
        setPlotType("scatter"); // Small dataset
      } else if (dataSize >= 50 && dataSize <= 500) {
        setPlotType("line"); // Medium dataset
      } else {
        setPlotType("bar"); // Large dataset
      }

      // Randomly select two features
      const randomFeatures = columns.sort(() => 0.5 - Math.random()).slice(0, 2);
      setSelectedFeatures(randomFeatures);

      const xData = data.map((row) => parseFloat(row[randomFeatures[0]]));
      const yData = data.map((row) => parseFloat(row[randomFeatures[1]]));

      setPlotData({
        labels: xData,
        datasets: [
          {
            label: `Visualization: ${plotType}`,
            data: plotType === "scatter"
              ? xData.map((x, index) => ({ x, y: yData[index] }))
              : yData,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    }
  }, [data, columns, plotType]);

  const handleCustomize = () => {
    history.push({
      pathname: "/customize",
      state: { data, columns }, // Pass data and columns to the Customize page
    });
  };

  if (!data || !columns) {
    return <div>No data available. Please upload a CSV file on the home page.</div>;
  }

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>{plotType.charAt(0).toUpperCase() + plotType.slice(1)} Plot</h1>
      <p>
        Visualizing <b>{selectedFeatures[0]}</b> (X-axis) vs. <b>{selectedFeatures[1]}</b> (Y-axis)
      </p>
      {plotData && (
        <div style={{ width: "80%", margin: "0 auto" }}>
          {plotType === "scatter" && <Scatter data={plotData} />}
          {plotType === "line" && <Line data={plotData} />}
          {plotType === "bar" && <Bar data={plotData} />}
        </div>
      )}
      <Button type="primary" style={{ marginTop: "20px" }} onClick={handleCustomize}>
        Customize Visualization
      </Button>
    </div>
  );
};

export default Visualization;
