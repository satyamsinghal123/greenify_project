import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Homepage/Homepage.css";
import Reportpage from "../Reportpage/Reportpage";
import PostCard from "../../Components/PostCard/PostCard";

function Homepage() {
  const [posts, setPosts] = useState([]);
  const [reportPostId, setReportPostId] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId");

  const navigate = useNavigate();

  const openUserProfile = (userKey) => {
    navigate(`/user/${userKey}`);
  };

  // LOAD FEED
  useEffect(() => {
    const loadFeed = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8080/api/posts/feed", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
          p.pid === pid
            ? { ...p, likecount: res.data.likecount, liked: res.data.liked }
            : p
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
          headers: { Authorization: `Bearer ${token}` },
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
        <p className="page-subtitle">
          Share your sustainable journey and inspire others
        </p>
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
            <PostCard
              key={post.pid}
              post={post}
              onLike={handleLike}
              onReport={openReportModal}
              onUserClick={openUserProfile}
              showMenu={true}
            />
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
