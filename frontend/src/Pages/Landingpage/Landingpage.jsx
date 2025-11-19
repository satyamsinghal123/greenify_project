import "../Landingpage/Landingpage.css";
import { Link } from 'react-router-dom';

function Landingpage() {
  return (
    <div className="landing-page">
      {/* Nature Background with Parallax */}
      <div className="nature-background">
        <div className="parallax-layer sky"></div>
        <div className="parallax-layer mountains"></div>
        <div className="parallax-layer forest"></div>
        <div className="parallax-layer ground"></div>
        <div className="overlay-gradient"></div>
      </div>

      {/* Main Content */}
      <div className="landing-content">
        {/* Header */}
        <header className="landing-header">
          <div className="logo">
            <span className="logo-icon">🌿</span>
            <span className="logo-text">Greenify</span>
          </div>
        </header>

        {/* Hero Section */}
        <main className="hero-section">
          <div className="hero-content">
            <div className="earth-pulse">
              <div className="pulse-circle"></div>
              <div className="earth-core">
                <span className="earth-icon">🌍</span>
              </div>
            </div>
            
            <h1 className="main-headline">
              <span className="line-1">Every Seed You Plant</span>
              <span className="line-2">Grows a Better</span>
              <span className="line-3 highlight">Tomorrow</span>
            </h1>

            <p className="hero-message">
              Join a community where your love for nature meets meaningful action. 
              Share your journey, inspire others, and watch your small steps create 
              waves of change for our planet.
            </p>

            {/* Emotional Call to Action */}
            <div className="cta-section">
              <div className="cta-text">
                <p>Ready to make your mark on Earth?</p>
              </div>
              <div className="cta-buttons">
                <Link to="/signup" className="cta-btn primary">
                  <span className="btn-icon">🌱</span>
                  Start My Journey
                </Link>
                <Link to="/login" className="cta-btn secondary">
                  Continue My Path
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* Emotional Impact Section */}
        <section className="impact-section">
          <div className="impact-cards">
            <div className="impact-card">
              <div className="impact-icon">💚</div>
              <h3>Your Actions Matter</h3>
              <p>Every sustainable choice you make creates a ripple effect that reaches farther than you imagine</p>
            </div>
            <div className="impact-card">
              <div className="impact-icon">🤝</div>
              <h3>Together We Grow</h3>
              <p>Connect with thousands who share your passion for preserving our beautiful planet</p>
            </div>
            <div className="impact-card">
              <div className="impact-icon">📈</div>
              <h3>See Your Impact</h3>
              <p>Watch your eco-friendly habits inspire others and create real environmental change</p>
            </div>
          </div>
        </section>

        {/* Nature Quote */}
        <section className="quote-section">
          <div className="quote-container">
            <blockquote className="nature-quote">
              "The Earth does not belong to us: we belong to the Earth."
            </blockquote>
            <cite className="quote-author">- Marlee Matlin</cite>
          </div>
        </section>
      </div>

      {/* Floating Nature Elements */}
      <div className="floating-nature">
        <div className="floating-leaf">🍃</div>
        <div className="floating-seed">🌰</div>
        <div className="floating-flower">🌼</div>
        <div className="floating-leaf">🍂</div>
        <div className="floating-seed">🌻</div>
      </div>
    </div>
  );
}

export default Landingpage;