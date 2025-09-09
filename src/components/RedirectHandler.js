import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageUtils } from '../utils/storage';
import { logger } from '../utils/logger';

const RedirectHandler = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        logger.info('Redirect attempt', { shortcode });

        // Get URL data from storage
        const urlData = storageUtils.getUrl(shortcode);
        
        if (!urlData) {
          setStatus('error');
          setError('Short URL not found');
          logger.warn('Short URL not found', { shortcode });
          return;
        }

        // Check if URL has expired (if expiration is set)
        if (urlData.expiresAt && new Date() > new Date(urlData.expiresAt)) {
          setStatus('error');
          setError('This short URL has expired');
          logger.warn('Short URL expired', { shortcode, expiresAt: urlData.expiresAt });
          return;
        }

        // Get click data
        const clickData = {
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          timestamp: new Date().toISOString(),
          ip: 'unknown' // In a real app, you'd get this from the server
        };

        // Record the click
        storageUtils.recordClick(shortcode, clickData);
        logger.info('Click recorded', { shortcode, clickData });

        // Redirect to the original URL
        window.location.href = urlData.originalUrl;
        
      } catch (error) {
        logger.error('Redirect error', { shortcode, error: error.message });
        setStatus('error');
        setError('An error occurred while redirecting');
      }
    };

    if (shortcode) {
      handleRedirect();
    } else {
      setStatus('error');
      setError('Invalid short URL');
    }
  }, [shortcode]);

  if (status === 'loading') {
    return (
      <div className="redirect-page">
        <div className="redirect-content">
          <div className="loading-spinner"></div>
          <h2>Redirecting...</h2>
          <p>Please wait while we redirect you to your destination.</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="redirect-page">
        <div className="redirect-content error">
          <h2>Redirect Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/')} 
            className="home-btn"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default RedirectHandler;
