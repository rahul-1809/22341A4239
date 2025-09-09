import React, { useState } from 'react';
import UrlForm from '../components/UrlForm';
import UrlResults from '../components/UrlResults';
import { logger } from '../utils/logger';

const ShortenerPage = () => {
  const [results, setResults] = useState([]);

  const handleUrlAdded = (newResults) => {
    setResults(newResults);
    logger.info('URLs processed', { count: newResults.length });
  };

  const handleClearResults = () => {
    setResults([]);
    logger.info('Results cleared');
  };

  return (
    <div className="shortener-page">
      <div className="container">
        <div className="page-header">
          <h1>URL Shortener</h1>
          <p>Create short, memorable links for your URLs. Share them easily and track their performance.</p>
        </div>

        <div className="page-content">
          <UrlForm onUrlAdded={handleUrlAdded} />
          <UrlResults results={results} onClear={handleClearResults} />
        </div>

        <div className="features">
          <h3>Features</h3>
          <div className="features-grid">
            <div className="feature-item">
              <h4>🔗 Quick Shortening</h4>
              <p>Shorten up to 5 URLs at once with our efficient processing.</p>
            </div>
            <div className="feature-item">
              <h4>🎯 Custom Shortcodes</h4>
              <p>Create memorable shortcodes for your most important links.</p>
            </div>
            <div className="feature-item">
              <h4>📊 Click Analytics</h4>
              <p>Track clicks and view detailed statistics for all your links.</p>
            </div>
            <div className="feature-item">
              <h4>🔒 Secure & Private</h4>
              <p>All data is stored locally in your browser for maximum privacy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortenerPage;
