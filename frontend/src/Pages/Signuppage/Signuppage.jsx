import React, { useState } from "react";
import "../Signuppage/Signuppage.scss";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signuppage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }

    if (!gender) {
      alert("Please select gender!");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/register", {
        name: name.trim(),   // IMPORTANT: clean username for stable avatar
        email,
        password,
        gender
      });

      if (res.data.token) {
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("userId", res.data.userId);
        sessionStorage.setItem("name", res.data.name);
        sessionStorage.setItem("profileImage", res.data.profileImage);

        alert("Welcome to Greenify! 🌿");
        navigate("/home");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">

        {/* LEFT - HERO (Now on Left like Login) */}
        <div className="signup-hero">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="brand-logo">
              <span className="logo-icon">🌿</span>
              <h1 className="brand-title">Greenify</h1>
            </div>
            <div className="hero-text">
              <h2>Join Our Eco Community</h2>
              <p>Be part of a movement towards a sustainable future.</p>
            </div>
          </div>
        </div>

        {/* RIGHT - FORM (Now on Right like Login) */}
        <div className="signup-form-section">
          <div className="form-container">

            <div className="form-header">
              <Link to="/" className="back-link">
                <span className="back-icon">←</span>
                Back to Home
              </Link>
              <h1>Join Greenify Today</h1>
              <p>Start your sustainable journey with us</p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="signup-form">
              
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* GENDER */}
              <div className="input-group">
                <label htmlFor="gender">Gender</label>
                <div className="input-wrapper">
                  <span className="input-icon">👥</span>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    disabled={loading}
                  >
                    <option value="">Choose gender</option>
                    <option value="boy">Boy</option>
                    <option value="girl">Girl</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="password"
                    type="password"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">✅</span>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="terms-agreement">
                <label className="agree-checkbox">
                  <input type="checkbox" required />
                  <span className="checkmark"></span>
                  I agree to the Terms and Privacy Policy
                </label>
              </div>

              <button type="submit" className={`signup-btn ${loading ? "loading" : ""}`} disabled={loading}>
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🌿</span>
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="login-link">
              <p>Already have an account? <Link to="/login" className="link">Sign in</Link></p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Signuppage;
