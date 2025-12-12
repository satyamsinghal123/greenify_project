import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../UserProfile/UserProfile.css";
import PostCard from "../../Components/PostCard/PostCard";

function UserProfile() {
  const { userKey } = useParams();
  const token = sessionStorage.getItem("token");
  const myId = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:8080/api/users/${userKey}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.error) return;

        setUser(res.data);
        setIsFollowing(res.data.followed);

        const feed = await axios.get(
          "http://localhost:8080/api/posts/feed",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const userPosts = feed.data.filter(
          (p) => p.userIdKey === userKey
        );

        setPosts(userPosts);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userKey, token]);

  const handleMessage = async () => {
    const res = await axios.post(
      "http://localhost:8080/api/chat/conversation",
      { targetUserKey: user.userIdKey },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.error) return;

    navigate("/messages", { state: { openConversationId: res.data.conversationId } });
  };

  if (loading) return <div>Loading profile...</div>;
  if (!user) return <div>User not found</div>;

  const isOwn = myId === user.userId;

  return (
    <div className="user-profile-page">
      <div className="profile-container">
        {/* Cover Section */}
        <div className="profile-cover">
          <div className="cover-overlay"></div>
        </div>

        {/* Profile Header Section */}
        <div className="profile-header-section">
          <div className="profile-avatar-wrapper">
            <img 
              src={user.profileImage} 
              className="avatar-large" 
              alt={user.name} 
              onError={(e) => {
                e.target.src = "https://avatar.iran.liara.run/public/boy";
              }}
            />
            <div className={`status-indicator ${user.online ? 'online' : 'offline'}`}></div>
          </div>

          <div className="profile-info-card">
            <div className="profile-identity">
              <h1 className="user-name secret">{user.name}</h1>
              <p className="user-username">@{user.username || user.name.toLowerCase().replace(/\s/g, '')}</p>
            </div>

            <div className="profile-actions">
              {!isOwn ? (
                <button className="btn primary-btn" onClick={handleMessage}>
                  <span className="btn-icon">💬</span> Message
                </button>
              ) : (
                <Link to="/profile" className="btn secondary-btn">
                  <span className="btn-icon">✏️</span> Edit Profile
                </Link>
              )}
            </div>

            <div className="profile-stats-row">
               <div className="stat-box">
                  <span className="stat-value">{posts.length}</span>
                  <span className="stat-label">Posts</span>
               </div>
               <div className="stat-box">
                  <span className="stat-value">{user.followersCount || 0}</span>
                  <span className="stat-label">Followers</span>
               </div>
               <div className="stat-box">
                  <span className="stat-value">{user.followingCount || 0}</span>
                  <span className="stat-label">Following</span>
               </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="profile-content-tabs">
          <button 
            className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
          {/* Add more tabs here if needed in future */}
        </div>

        {/* Posts Grid */}
        <div className="posts-grid-container">
          {posts.length > 0 ? (
            <div className="posts-grid">
              {posts.map((p) => (
                <PostCard
                  key={p.pid}
                  post={{
                    ...p,
                    userName: user.name,
                    userImage: user.profileImage
                  }}
                  onLike={() => {}}
                  onReport={() => {}}
                  showMenu={false}
                />
              ))}
            </div>
          ) : (
            <div className="no-posts-state">
              <div className="empty-icon">🌱</div>
              <h3>No posts yet</h3>
              <p>This user hasn't shared any moments yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
