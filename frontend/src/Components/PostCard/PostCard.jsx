import React, { useState } from "react";
import "./PostCard.css";

function PostCard({ post, onLike, onReport, onUserClick, showMenu = false }) {
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLikeAnimating(true);
    onLike(post.pid);
    setTimeout(() => setIsLikeAnimating(false), 300);
  };

  const handleReportClick = (e) => {
    e.stopPropagation();
    onReport(post.pid);
  };

  const handleUserClick = (e) => {
    e.stopPropagation();
    if (onUserClick) {
      onUserClick(post.userIdKey);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="post-card-unified">
      {/* Header */}
      <div className="post-header" onClick={handleUserClick}>
        <div className="post-user-info">
          <div className="post-avatar">
            <img 
              src={post.userImage || "https://avatar.iran.liara.run/public/boy"} 
              alt={post.userName}
              className="post-avatar-img"
              onError={(e) => { e.target.src = "https://avatar.iran.liara.run/public/boy"; }}
              style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}}
            />
          </div>
          <div className="post-meta">
            <span className="post-username">{post.userName || "Anonymous"}</span>
            {post.location && <span className="post-location">{post.location}</span>}
          </div>
        </div>
        {showMenu && (
          <button className="post-menu-btn" onClick={(e) => e.stopPropagation()}>
            ⋯
          </button>
        )}
      </div>

      {/* Image */}
      <div className="post-media-container" onDoubleClick={handleLikeClick}>
        <img
          src={`http://localhost:8080/api/posts/image/${post.imageKey}`}
          alt="Post content"
          className="post-media-image"
          loading="lazy"
        />
        <div className={`like-overlay ${isLikeAnimating ? "animate" : ""}`}>
          ❤️
        </div>
      </div>

      {/* Content & Actions */}
      <div className="post-footer">
        <div className="post-actions-row">
          <div className="left-actions">
            <button 
              className={`action-btn like-btn ${post.liked ? "liked" : ""}`}
              onClick={handleLikeClick}
            >
              <span className="action-icon">{post.liked ? "❤️" : "🤍"}</span>
            </button>
            <button className="action-btn comment-btn">
              <span className="action-icon">💬</span>
            </button>
            <button className="action-btn share-btn">
              <span className="action-icon">📤</span>
            </button>
          </div>
          <div className="right-actions">
            <button className="action-btn report-btn" onClick={handleReportClick}>
              <span className="action-icon">⚠️</span>
            </button>
          </div>
        </div>

        <div className="post-likes-count">
          {post.likecount || 0} likes
        </div>

        <div className="post-caption">
          <span className="caption-username" onClick={handleUserClick}>
            {post.userName || "Anonymous"}
          </span>
          <span className="caption-text">{post.text}</span>
        </div>

        <div className="post-timestamp">
          {formatDate(post.createdAt || new Date())}
        </div>
      </div>
    </div>
  );
}

export default PostCard;
