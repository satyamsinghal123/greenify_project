import React, { useState, useEffect } from "react";
import "../Profilepage/ProfilePage.css";
import axios from "axios";
import { Link } from "react-router-dom";
import Reportpage from "../Reportpage/Reportpage";

function Profilepage() {
  const [posts, setPosts] = useState([]);
  const [reportPostId, setReportPostId] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");
  const name = sessionStorage.getItem("name");
  const profileImage = sessionStorage.getItem("profileImage");

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

  // Calculate profile stats
  const profileStats = {
    posts: posts.length,
    totalLikes: posts.reduce((sum, post) => sum + (post.likecount || 0), 0),
    engagement: posts.length > 0 ? Math.round((posts.reduce((sum, post) => sum + (post.likecount || 0), 0) / posts.length) * 10) / 10 : 0
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading your sustainable journey...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* PROFILE HEADER */}
      <div className="profile-hero">
        <div className="profile-background">
          <div className="background-pattern"></div>
        </div>
        
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-container">
                <img 
                  src={profileImage || "/default-avatar.png"} 
                  alt="Profile" 
                  className="avatar-image"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2327ae60'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
                  }}
                />
                <div className="avatar-status"></div>
              </div>
            </div>

            <div className="profile-info">
              <h1 className="profile-name">{name || 'Eco Warrior'}</h1>
              <p className="profile-bio">Sharing sustainable living tips and environmental stories</p>
              
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
                  <span className="stat-label">Avg. Engagement</span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <Link to="/createpost" className="create-post-btn">
                <span className="btn-icon">📝</span>
                Create Post
              </Link>
              <button className="edit-profile-btn">
                <span className="btn-icon">⚙️</span>
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT TABS */}
      <div className="profile-content">
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === "posts" ? "active" : ""}`}
              onClick={() => setActiveTab("posts")}
            >
              <span className="tab-icon">📱</span>
              Your Posts
            </button>
            <button 
              className={`tab ${activeTab === "liked" ? "active" : ""}`}
              onClick={() => setActiveTab("liked")}
            >
              <span className="tab-icon">❤️</span>
              Liked Posts
            </button>
            <button 
              className={`tab ${activeTab === "saved" ? "active" : ""}`}
              onClick={() => setActiveTab("saved")}
            >
              <span className="tab-icon">📥</span>
              Saved Posts
            </button>
          </div>
        </div>

        {/* POSTS GRID */}
        <div className="posts-section">
          {posts.length === 0 ? (
            <div className="empty-posts">
              <div className="empty-icon">🌱</div>
              <h3>No posts yet</h3>
              <p>Start your sustainable journey by sharing your first post!</p>
              <Link to="/createpost" className="btn primary">
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <div key={post.pid} className="post-card">
                  {/* POST HEADER */}
                  <div className="post-header">
                    <div className="post-user">
                      <div className="user-avatar-small">
                        {name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="username">{name || 'You'}</span>
                    </div>
                    <div className="post-actions-menu">
                      <button className="menu-btn">⋯</button>
                    </div>
                  </div>

                  {/* POST IMAGE */}
                  <div className="post-media">
                    <img
                      src={`http://localhost:8080/api/posts/image/${post.imageKey}`}
                      alt="Sustainable post"
                      className="post-image"
                    />
                    <div className="media-overlay"></div>
                  </div>

                  {/* POST CONTENT */}
                  <div className="post-content">
                    <p className="post-text">{post.text}</p>
                    
                    {/* POST ACTIONS */}
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

                      <button className="comment-btn">
                        <span className="comment-icon">💬</span>
                        Comment
                      </button>

                      <button
                        className="report-btn"
                        onClick={() => openReportModal(post.pid)}
                      >
                        <span className="report-icon">⚠️</span>
                      </button>
                    </div>

                    {/* POST STATS */}
                    <div className="post-stats">
                      <span className="stat">{post.likecount || 0} likes</span>
                      <span className="stat">•</span>
                      <span className="stat">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
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