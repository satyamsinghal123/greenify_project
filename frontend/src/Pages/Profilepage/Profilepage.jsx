import React, { useState, useEffect } from "react";
import "../Profilepage/ProfilePage.css";
import axios from "axios";
import { Link } from "react-router-dom";
import Reportpage from "../Reportpage/Reportpage";
import PostCard from "../../Components/PostCard/PostCard";

function Profilepage() {
  const [posts, setPosts] = useState([]);
  const [reportPostId, setReportPostId] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");
  const name = sessionStorage.getItem("name");
  const profileImage = sessionStorage.getItem("profileImage"); // STORED AVATAR

  useEffect(() => {
    if (!userId || !token) return;

    const loadPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8080/api/posts/user-secure/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts(res.data);
      } catch (err) {
        console.error("Post fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [userId, token]);

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

  const openReportModal = (pid) => {
    setReportPostId(pid);
    setShowReport(true);
  };

  const submitReport = async (reason) => {
    try {
      await axios.post(
        "http://localhost:8080/api/posts/report",
        { postId: reportPostId, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Report submitted!");
      setShowReport(false);

    } catch (err) {
      console.error("Report error", err);
      alert("Failed to submit report");
    }
  };

  const profileStats = {
    posts: posts.length,
    totalLikes: posts.reduce((sum, post) => sum + (post.likecount || 0), 0),
    engagement:
      posts.length > 0
        ? Math.round(
            (posts.reduce((sum, post) => sum + (post.likecount || 0), 0) /
              posts.length) *
              10
          ) / 10
        : 0,
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">

      {/* HEADER */}
      <div className="profile-hero">
        <div className="profile-container">
          <div className="profile-header">

            <div className="profile-avatar">
              <div className="avatar-container">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="avatar-image"
                  onError={(e) => (e.target.src = profileImage)} // FIX: always fallback to stored avatar
                />
              </div>
            </div>

            <div className="profile-info">
              <h1 className="profile-name">{name}</h1>

              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">{profileStats.posts}</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{profileStats.totalLikes}</span>
                  <span className="stat-label">Likes</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{profileStats.engagement}</span>
                  <span className="stat-label">Engagement</span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <Link to="/createpost" className="create-post-btn">📝 Create Post</Link>
              <button
                className="edit-profile-btn"
                onClick={() => (window.location.href = "/conversations")}
              >
                💬 Messages
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="profile-content">

        <div className="tabs">
          <button
            className={`tab ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => setActiveTab("posts")}
          >
            📱 Your Posts
          </button>

          <button
            className={`tab ${activeTab === "liked" ? "active" : ""}`}
            onClick={() => setActiveTab("liked")}
          >
            ❤️ Liked
          </button>

          <button
            className={`tab ${activeTab === "saved" ? "active" : ""}`}
            onClick={() => setActiveTab("saved")}
          >
            📥 Saved
          </button>
        </div>

        <div className="posts-section">
          {posts.length === 0 ? (
            <div className="empty-posts">
              <h3>No posts yet</h3>
              <Link to="/createpost" className="btn primary">
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <PostCard
                  key={post.pid}
                  post={{
                    ...post,
                    userName: name,
                    userImage: profileImage
                  }}
                  onLike={handleLike}
                  onReport={openReportModal}
                  showMenu={true}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      <Reportpage
        show={showReport}
        onClose={() => setShowReport(false)}
        onSubmit={submitReport}
      />

    </div>
  );
}

export default Profilepage;
