import React, { useState } from "react";
import axios from "axios";

const Learning = () => {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
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
      // Fetch Articles from Dev.to
      const textResponse = await axios.get(
        `https://dev.to/api/articles?tag=${query}`
      );

      // Fetch Videos from YouTube API
      const videoResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
      );

      // Fetch Images from Unsplash API
      const imageResponse = await axios.get(
        `https://api.unsplash.com/search/photos?query=${query}&client_id=${process.env.REACT_APP_UNSPLASH_API_KEY}`
      );

      // Filter Articles by relevance
      const filteredArticles = textResponse.data.filter((article) =>
        article.title.toLowerCase().includes(query.toLowerCase())
      );

      // Update State
      setArticles(filteredArticles);
      setVideos(videoResponse.data.items);
      setImages(imageResponse.data.results);
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
        <div>
          {/* Articles Section */}
          <h2>Articles</h2>
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <div key={index}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "#007BFF" }}
                >
                  {article.title}
                </a>
              </div>
            ))
          ) : (
            <p>No articles found for "{query}".</p>
          )}

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

          {/* Images Section */}
          <h2>Images</h2>
          {images.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image.urls.small}
                  alt={image.alt_description || "Image"}
                  style={{
                    width: "200px",
                    height: "auto",
                    borderRadius: "5px",
                  }}
                />
              ))}
            </div>
          ) : (
            <p>No images found for "{query}".</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Learning;
