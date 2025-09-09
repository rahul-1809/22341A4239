import React from 'react';
import { urlUtils } from '../utils/urlUtils';

const UrlResults = ({ results, onClear }) => {
  if (!results || results.length === 0) {
    return null;
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="url-results">
      <div className="results-header">
        <h3>Shortened URLs</h3>
        <button onClick={onClear} className="clear-btn">
          Clear Results
        </button>
      </div>

      <div className="results-list">
        {results.map((result, index) => (
          <div key={index} className={`result-item ${result.success ? 'success' : 'error'}`}>
            {result.success ? (
              <>
                <div className="result-content">
                  <div className="original-url">
                    <strong>Original:</strong>
                    <span className="url-text">{result.originalUrl}</span>
                  </div>
                  <div className="short-url">
                    <strong>Short:</strong>
                    <span className="url-text">{result.shortUrl}</span>
                    <button
                      onClick={() => copyToClipboard(result.shortUrl)}
                      className="copy-btn"
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                  </div>
                  <div className="expiry-info">
                    <strong>Expires:</strong>
                    <span className="expiry-date">
                      {new Date(result.expiresAt).toLocaleString()}
                    </span>
                  </div>
                  {result.customShortcode && (
                    <div className="custom-badge">
                      Custom shortcode
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="result-content">
                <div className="error-message">
                  <strong>Error:</strong> {result.error}
                </div>
                <div className="original-url">
                  <strong>URL:</strong> {result.originalUrl}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UrlResults;
