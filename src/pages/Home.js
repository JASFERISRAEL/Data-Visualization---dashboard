import React, { useState } from "react";
import { Upload, Button, message, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import Papa from "papaparse";

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

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <Title>Welcome</Title>
      <p>Transform your data into something amazing!</p>
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
  );
};

export default Home;
