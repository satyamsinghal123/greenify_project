import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Homepage/Homepage.css";
import Reportpage from "../Reportpage/Reportpage";

function Homepage() {
  const [posts, setPosts] = useState([]);
  const [reportPostId, setReportPostId] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId");

  // LOAD FEED
  useEffect(() => {
    const loadFeed = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:8080/api/posts/feed",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts(res.data);
      } catch (err) {
        console.error("Feed error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, [token]);

  // LIKE / UNLIKE HANDLER
  const handleLike = async (pid) => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/posts/like/${pid}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prev) =>
        prev.map((p) =>
          p.pid === pid ? { ...p, likecount: res.data.likecount, liked: res.data.liked } : p
        )
      );
    } catch (err) {
      console.error("Like error", err);
    }
  };

  // REPORT HANDLER
  const openReportModal = (pid) => {
    setReportPostId(pid);
    setShowReport(true);
  };

  const submitReport = async (reason) => {
    try {
      await axios.post(
        "http://localhost:8080/api/posts/report",
        {
          postId: reportPostId,
          reason,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Report submitted successfully!");
      setShowReport(false);
    } catch (err) {
      console.error("Report error", err);
      alert("Failed to submit report");
    }
  };

  if (loading) {
    return (
      <div className="homepage-loading">
        <div className="loading-spinner"></div>
        <p>Loading eco-friendly content...</p>
      </div>
    );
  }

  return (
    <div className="homepage">
      <div className="homepage-header">
        <div className="page-title">
          <span className="leaf-icon">🌿</span>
          Greenify Community
        </div>
        <p className="page-subtitle">Share your sustainable journey and inspire others</p>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌱</div>
          <h3>No posts yet</h3>
          <p>Be the first to share your environmental story!</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.pid} className="post-card">
              {/* USER HEADER */}
              <div className="post-header">
                <div className="user-avatar">
                  {post.userName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="user-info">
                  <span className="username">{post.userName || 'Anonymous'}</span>
                  <span className="post-time">Recently</span>
                </div>
              </div>

              {/* IMAGE */}
              <div className="media-container">
                <img
                  src={`http://localhost:8080/api/posts/image/${post.imageKey}`}
                  alt="Sustainable living post"
                  className="post-image"
                />
                <div className="image-overlay"></div>
              </div>

              {/* TEXT CONTENT */}
              <div className="post-content">
                <p className="post-text">{post.text}</p>
                
                {/* ACTIONS */}
                <div className="post-actions">
                  <button 
                    className={`like-btn ${post.liked ? 'liked' : ''}`} 
                    onClick={() => handleLike(post.pid)}
                  >
                    <span className="like-icon">
                      {post.liked ? '❤️' : '🤍'}
                    </span>
                    <span className="like-count">{post.likecount || 0}</span>
                  </button>

                  <button
                    className="report-btn"
                    onClick={() => openReportModal(post.pid)}
                  >
                    <span className="report-icon">⚠️</span>
                    Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Reportpage
        show={showReport}
        onClose={() => setShowReport(false)}
        onSubmit={submitReport}
      />
    </div>
  );
}

export default Homepage;