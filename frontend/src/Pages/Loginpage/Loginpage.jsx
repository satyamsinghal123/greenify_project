import React, { useState } from "react";
import "../Loginpage/Loginpage.css";
import lbg from "../Assets/images/lbg.gif"
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Loginpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/login", {
        email,
        password,
      });

      if (res.data.token) {
        // Save user data to session storage
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("userId", res.data.userId);
        sessionStorage.setItem("name", res.data.name);
        sessionStorage.setItem("profileImage", res.data.profileImage);

        alert("Login successful! 🌱");
        navigate("/home");
      } else {
        alert(res.data.message || "Login failed!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Brand & Visual */}
        <div className="login-hero">
          <div className="hero-content">
            <div className="brand-logo">
              <span className="logo-icon">🌿</span>
              <h1 className="brand-title">Greenify</h1>
            </div>
            <div className="hero-text">
              <h2>Welcome Back!</h2>
              <p>Continue your sustainable journey with the Greenify community</p>
            </div>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">🌍</span>
                <span>Join eco-friendly discussions</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <span>Share your sustainable stories</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🤝</span>
                <span>Connect with like-minded people</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Log In to Your Account</h2>
              <p>Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <a href="#" className="forgot-password">
                  Forgot password?
                </a>
              </div>

              <button 
                type="submit" 
                className={`login-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Logging In...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🌱</span>
                    LogIn
                  </>
                )}
              </button>
            </form>

            <div className="signup-link">
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="link">
                  Create one here
                </Link>
              </p>
            </div>

            <div className="divider">
              <span>Or continue with</span>
            </div>

            <div className="social-login">
              <button className="social-btn google-btn">
                <span className="social-icon">🔍</span>
                Google
              </button>
              <button className="social-btn facebook-btn">
                <span className="social-icon">📘</span>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loginpage;