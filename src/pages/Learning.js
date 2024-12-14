import React, { useState } from "react";
import axios from "axios";

const Learning = () => {
  const [query, setQuery] = useState("");
  
  const [videos, setVideos] = useState([]);
 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchResources = async () => {
    if (!query.trim()) {
      setError("Please enter a valid search query.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      

      // Fetch Videos from YouTube API
      const videoResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
      );

      


      // Update State
      setVideos(videoResponse.data.items);
      
    } catch (err) {
      console.error("Error fetching resources:", err);
      setError("An error occurred while fetching resources. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Learning Resources</h1>
      <input
        type="text"
        placeholder="Search for topics like scatter plot..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          marginBottom: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      <button
        onClick={fetchResources}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Search
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ padding: "20px" }}>
       

          {/* Videos Section */}
          <h2>Videos</h2>
          {videos.length > 0 ? (
            videos.map((video, index) => (
              <div key={index}>
                <a
                  href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "#007BFF" }}
                >
                  {video.snippet.title}
                </a>
              </div>
            ))
          ) : (
            <p>No videos found for "{query}".</p>
          )}

          
        </div>
      )}
    </div>
  );
};

export default Learning;
