import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>AffordMed</h1>
            <span className="tagline">URL Shortener</span>
          </Link>
          
          <nav className="nav">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Shorten URLs
            </Link>
            <Link 
              to="/stats" 
              className={`nav-link ${location.pathname === '/stats' ? 'active' : ''}`}
            >
              Statistics
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
