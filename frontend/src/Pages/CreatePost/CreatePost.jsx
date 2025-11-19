import React, { useState } from "react";
import axios from "axios";
import "../CreatePost/CreatePost.css";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  const processFile = (selectedFile) => {
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB");
        return;
      }
      
      if (!selectedFile.type.startsWith('image/')) {
        alert("Please select an image file");
        return;
      }

      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleCreatePost = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (!file) {
      alert("Please select an image");
      return;
    }

    if (!text.trim()) {
      alert("Please add some text");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("text", text);

      const res = await axios.post(
        "http://localhost:8080/api/posts/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(res.data.message || "Post created successfully! 🌱");

      navigate("/profile");

      // Reset form
      setFile(null);
      setText("");
      setImagePreview(null);
      document.getElementById("image-upload").value = "";
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Error creating post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setFile(null);
    setImagePreview(null);
    document.getElementById("image-upload").value = "";
  };

  return (
    <div className="create-post-page">
      <div className="create-post-container">
        {/* Header */}
        <div className="post-header">
          <div className="header-content">
            <div className="header-icon">🌿</div>
            <div className="header-text">
              <h1>Create New Post</h1>
              <p>Share your sustainable journey with the Greenify community</p>
            </div>
          </div>
        </div>

        {/* Main Content - Side by Side Layout for Desktop */}
        <div className="post-content-wrapper">
          {/* Left Column - Image Upload */}
          <div className="content-column image-column">
            <div className="form-section">
              <label className="section-label">
                <span className="label-icon">🖼️</span>
                Upload Your Image
              </label>
              
              <div 
                className={`upload-area ${dragActive ? 'drag-active' : ''} ${imagePreview ? 'has-image' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
                
                {!imagePreview ? (
                  <div className="upload-content">
                    <div className="upload-icon">📤</div>
                    <div className="upload-text">
                      <p className="upload-title">Drag & Drop Your Image</p>
                      <p className="upload-subtitle">or click to browse files</p>
                    </div>
                    <div className="upload-info">
                      <div className="info-item">
                        <span className="info-icon">📷</span>
                        <span>JPG, PNG, WEBP</span>
                      </div>
                      <div className="info-item">
                        <span className="info-icon">💾</span>
                        <span>Max 5MB</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="image-preview-container">
                    <div className="preview-controls">
                      <span className="preview-badge">Image Preview</span>
                      <button 
                        className="remove-image-btn"
                        onClick={removeImage}
                        type="button"
                      >
                        <span className="btn-icon">🗑️</span>
                        Remove
                      </button>
                    </div>
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="quick-tips">
              <h3>📸 Photo Tips</h3>
              <div className="tips-grid">
                <div className="tip-item">
                  <span className="tip-icon">☀️</span>
                  <span>Use natural lighting</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🎯</span>
                  <span>Focus on your subject</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🌿</span>
                  <span>Show eco-friendly elements</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">📏</span>
                  <span>Use landscape orientation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form and Actions */}
          <div className="content-column form-column">
            {/* Description Section */}
            <div className="form-section">
              <label className="section-label">
                <span className="label-icon">📝</span>
                Post Description
              </label>
              
              <div className="textarea-container">
                <textarea
                  maxLength="500"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Share your environmental story, sustainable tips, or eco-friendly inspiration... What makes this post special for our community?"
                  className="post-textarea"
                ></textarea>
                
                <div className="textarea-footer">
                  <div className="char-count">
                    {text.length}/500 characters
                  </div>
                  <div className="writing-tips">
                    <span className="tip-icon">💡</span>
                    Be descriptive about your sustainable practice
                  </div>
                </div>
              </div>
            </div>

            {/* Post Inspiration */}
            <div className="inspiration-section">
              <h3>🎯 Post Inspiration</h3>
              <div className="inspiration-grid">
                <div className="inspiration-card">
                  <div className="card-icon">♻️</div>
                  <div className="card-content">
                    <h4>Recycling Setup</h4>
                    <p>Show your waste management system</p>
                  </div>
                </div>
                <div className="inspiration-card">
                  <div className="card-icon">🌍</div>
                  <div className="card-content">
                    <h4>Zero-Waste</h4>
                    <p>Document your reduction journey</p>
                  </div>
                </div>
                <div className="inspiration-card">
                  <div className="card-icon">🚲</div>
                  <div className="card-content">
                    <h4>Eco Transport</h4>
                    <p>Share sustainable mobility</p>
                  </div>
                </div>
                <div className="inspiration-card">
                  <div className="card-icon">🌿</div>
                  <div className="card-content">
                    <h4>Plant-Based</h4>
                    <p>Feature vegan recipes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button 
                className="cancel-btn"
                onClick={() => navigate("/profile")}
                type="button"
                disabled={loading}
              >
                <span className="btn-icon">←</span>
                Back to Profile
              </button>
              
              <button 
                className={`submit-btn ${loading ? 'loading' : ''}`}
                onClick={handleCreatePost}
                disabled={loading || !file || !text.trim()}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Creating Post...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🌱</span>
                    Publish Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;