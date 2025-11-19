import { Link, useLocation, useNavigate } from "react-router-dom";
import "../Navbar/Navbar.css";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isAuthPage = ["/", "/signup", "/login"].includes(location.pathname);
  const isLoggedIn = !isAuthPage;

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link 
          to={isLoggedIn ? "/home" : "/"} 
          className="nav-logo"
          onClick={closeMobileMenu}
        >
          <div className="logo-icon">🌿</div>
          <span className="logo-text">Greenify</span>
        </Link>

        {/* Navigation Links */}
        <div className={`nav-menu ${isMobileMenuOpen ? "mobile-open" : ""}`}>
          {isLoggedIn ? (
            <>
              <Link 
                to="/home" 
                className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">🏠</span>
                Home
              </Link>
              
              <Link 
                to="/profile" 
                className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">👤</span>
                Profile
              </Link>

              <button 
                className="nav-link logout-btn"
                onClick={handleLogout}
              >
                <span className="nav-icon">🚪</span>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">🔑</span>
                Login
              </Link>
              
              <Link 
                to="/signup" 
                className="nav-link signup-btn"
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">✨</span>
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-btn ${isMobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="mobile-menu-overlay"
            onClick={closeMobileMenu}
          ></div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;