import React, { useState } from "react";
import { Upload, Button, message, Typography, Breadcrumb } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import Papa from "papaparse";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import {ReactTyped} from "react-typed"; // Import ReactTyped
import "../assets/styles/Home.css";

const Home = () => {
  const { Title } = Typography;
  const [file, setFile] = useState(null);
  const history = useHistory();

  const props = {
    name: "file",
    accept: ".csv",
    multiple: false,
    beforeUpload: (file) => {
      setFile(file);
      return false; // Prevent automatic upload
    },
    onRemove: () => {
      setFile(null);
    },
  };

  const handleUpload = () => {
    if (!file) {
      message.error("Please select a file to upload!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      Papa.parse(event.target.result, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const data = result.data; // Parsed CSV data
          const columns = Object.keys(data[0]); // Get column names
          message.success("File parsed successfully!");
          history.push({
            pathname: "/visualization",
            state: { data, columns },
          });
        },
        error: () => {
          message.error("Failed to parse the file!");
        },
      });
    };
    reader.readAsText(file);
  };

  const particlesInit = async (main) => {
    console.log("Particles Loaded:", main);
    await loadFull(main);
  };

  return (
    <div className="home-container">
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "#f0f2f5", // Light grey background
            },
          },
          fpsLimit: 60,
          particles: {
            color: {
              value: "#1890ff", // Particle color
            },
            links: {
              color: "#1890ff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 50, // Number of particles
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle", // Shape of particles
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />

      {/* Breadcrumb and Sign-in Button */}
      <div className="header" style={{ position: "relative", zIndex: 1 }}>
        <Breadcrumb style={{ marginBottom: "10px" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* Main Content */}
      <div className="content" style={{ position: "relative", zIndex: 1 }}>
        <Title>Welcome</Title>
        {/* Typing effect for the paragraph */}
        <p>
          <ReactTyped
            strings={["Transform your data into something amazing!"]}
            typeSpeed={100} // Speed of typing
            backSpeed={50} // Speed of backspacing (optional)
            backDelay={1000} // Delay before starting backspacing (optional)
            loop={false} // Whether it should loop
          />
        </p>
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Upload CSV File</Button>
        </Upload>
        <br />
        <Button
          type="primary"
          onClick={handleUpload}
          style={{ marginTop: "20px" }}
        >
          Analyze Data
        </Button>
      </div>
    </div>
  );
};

export default Home;
