import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Select, Button, message, Spin } from "antd";
import { Scatter, Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import { ChromePicker } from "react-color"; // Use ChromePicker for a more compact color picker

const { Option } = Select;

const Customized = () => {
  const { state } = useLocation();
  const history = useHistory();
  const { data = [], columns = [] } = state || {};
  const [selectedX, setSelectedX] = useState(null);
  const [selectedY, setSelectedY] = useState(null);
  const [plotType, setPlotType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plotColor, setPlotColor] = useState("#4CAF50");

  // Function to check if the selected column has numerical data
  const isNumerical = (column) => {
    return data.every((item) => !isNaN(parseFloat(item[column])));
  };

  const handleXChange = (value) => setSelectedX(value);
  const handleYChange = (value) => setSelectedY(value);
  const handlePlotChange = (type) => setPlotType(type);

  const handleApply = () => {
    if (!selectedX || !selectedY) {
      message.error("Please select both X and Y axes!");
      return;
    }
    if (selectedX === selectedY) {
      message.error("X-axis and Y-axis cannot be the same!");
      return;
    }
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const chartData = {
    labels: isNumerical(selectedX)
      ? data.map((_, index) => index)
      : [...new Set(data.map((item) => item[selectedX]))],
    datasets: [
      {
        label: `${selectedX} vs ${selectedY}`,
        data: isNumerical(selectedX) && isNumerical(selectedY)
          ? data.map((item) => ({
              x: parseFloat(item[selectedX]),
              y: parseFloat(item[selectedY]),
            }))
          : Object.entries(
              data.reduce((acc, item) => {
                const key = item[selectedX];
                acc[key] = acc[key] ? acc[key] + 1 : 1;
                return acc;
              }, {})
            ).map(([key, count]) => ({
              x: key,
              y: count,
            })),
        backgroundColor: plotColor, // General color for all plots
        borderColor: plotColor, // General color for border
        borderWidth: 1,
      },
    ],
  };

  const renderExplanation = () => {
    if (!selectedX || !selectedY) return null;

    if (isNumerical(selectedX) && isNumerical(selectedY)) {
      return (
        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <h3>Explanation</h3>
          <ul>
            <li>
              You have selected continuous data for both axes. This is suitable for Scatter Plot and Line Plot.
            </li>
            <li>Scatter Plot: Useful for visualizing relationships between two continuous variables.</li>
            <li>Line Plot: Ideal for visualizing trends over time or continuous data.</li>
          </ul>
        </div>
      );
    } else if (isNumerical(selectedX)) {
      return (
        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <h3>Explanation</h3>
          <ul>
            <li>
              You have selected a continuous variable for X and a categorical variable for Y. A Bar Chart is suitable for this scenario.
            </li>
            <li>Bar Chart: Useful for visualizing the frequency or count of categorical data points.</li>
          </ul>
        </div>
      );
    } else {
      return (
        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <h3>Explanation</h3>
          <ul>
            <li>You have selected categorical data for both axes. A Bar Chart is suitable for this scenario.</li>
            <li>Bar Chart: Useful for visualizing counts or relationships between categorical variables.</li>
          </ul>
        </div>
      );
    }
  };

  const renderPlot = () => {
    if (loading) {
      return <Spin size="large" />;
    }

    if (isNumerical(selectedX) && isNumerical(selectedY)) {
      if (plotType === "scatter") {
        return (
          <Scatter
            data={chartData}
            options={{
              plugins: {
                zoom: {
                  zoom: {
                    wheel: { enabled: true },
                    pinch: { enabled: true },
                    mode: "xy",
                  },
                  pan: { enabled: true, mode: "xy" },
                },
              },
            }}
            plugins={[zoomPlugin]}
          />
        );
      } else if (plotType === "line") {
        return (
          <Line
            data={chartData}
            options={{
              plugins: {
                zoom: {
                  zoom: {
                    wheel: { enabled: true },
                    pinch: { enabled: true },
                    mode: "xy",
                  },
                  pan: { enabled: true, mode: "xy" },
                },
              },
            }}
            plugins={[zoomPlugin]}
          />
        );
      }
    } else if (isNumerical(selectedX) || isNumerical(selectedY)) {
      return (
        <Bar
          data={chartData}
          options={{
            plugins: {
              legend: { display: false },
            },
          }}
        />
      );
    }
    return <p>Please select a plot type to view the visualization.</p>;
  };

  const handleBack = () => {
    if (data.length > 0 && columns.length > 0) {
      history.push("/visualization", { data, columns });
    } else {
      message.error("No data available to return to visualization.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Customize Visualization</h1>
      <p>Select columns for X and Y axes:</p>

      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
        <Select
          value={selectedX}
          onChange={handleXChange}
          style={{ width: 200, marginRight: "20px" }}
          placeholder="Select X-axis"
        >
          {columns.map((col) => (
            <Option key={col} value={col}>
              {col}
            </Option>
          ))}
        </Select>
        <Select
          value={selectedY}
          onChange={handleYChange}
          style={{ width: 200 }}
          placeholder="Select Y-axis"
        >
          {columns.map((col) => (
            <Option key={col} value={col}>
              {col}
            </Option>
          ))}
        </Select>
      </div>

      {/* Dynamic Explanation */}
      {renderExplanation()}

      {/* Plot Type Selection */}
      <div style={{ marginTop: "30px", display: "flex", justifyContent: "center", gap: "20px" }}>
        {isNumerical(selectedX) && isNumerical(selectedY) && (
          <>
            <Button
              onClick={() => handlePlotChange("scatter")}
              style={{ backgroundColor: plotType === "scatter" ? "#4CAF50" : "", color: plotType === "scatter" ? "white" : "" }}
              disabled={!selectedX || !selectedY || plotType === "scatter"}
            >
              Scatter Plot
            </Button>
            <Button
              onClick={() => handlePlotChange("line")}
              style={{ backgroundColor: plotType === "line" ? "#4CAF50" : "", color: plotType === "line" ? "white" : "" }}
              disabled={!selectedX || !selectedY || plotType === "line"}
            >
              Line Plot
            </Button>
          </>
        )}

        {(!isNumerical(selectedX) || !isNumerical(selectedY)) && (
          <Button
            onClick={() => handlePlotChange("bar")}
            style={{
              backgroundColor: plotType === "bar" ? "#4CAF50" : "",
              color: plotType === "bar" ? "white" : "",
            }}
            disabled={isNumerical(selectedX) || isNumerical(selectedY) || plotType === "bar"}
          >
            Bar Chart
          </Button>
        )}
      </div>

      {/* Color Picker shown only after plot type selection */}
      {plotType && (
        <div style={{ marginTop: "30px" }}>
          <h4>Choose Plot Color</h4>
          <ChromePicker
            color={plotColor}
            onChangeComplete={(color) => setPlotColor(color.hex)} // Set the selected color
            width="200px" // Reduce the width for compactness
          />
        </div>
      )}

      <Button
        type="primary"
        onClick={handleApply}
        style={{ marginTop: "20px" }}
      >
        Apply
      </Button>

      <div style={{ marginTop: "30px" }}>{renderPlot()}</div>

      <Button
        type="default"
        onClick={handleBack}
        style={{ marginTop: "20px" }}
      >
        Back to Visualization
      </Button>
    </div>
  );
};

export default Customized;
