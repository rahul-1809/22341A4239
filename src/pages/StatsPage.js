import React, { useState, useEffect } from 'react';
import { storageUtils } from '../utils/storage';
import { urlUtils } from '../utils/urlUtils';
import { logger } from '../utils/logger';

const StatsPage = () => {
  const [urls, setUrls] = useState({});
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUrls();
  }, []);

  const loadUrls = () => {
    try {
      const allUrls = storageUtils.getAllUrls();
      setUrls(allUrls);
      logger.info('URLs loaded for stats', { count: Object.keys(allUrls).length });
    } catch (error) {
      logger.error('Error loading URLs for stats', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlClick = (shortcode) => {
    const urlData = urls[shortcode];
    if (urlData) {
      setSelectedUrl({ shortcode, ...urlData });
    }
  };

  const handleDeleteUrl = (shortcode) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      const newUrls = { ...urls };
      delete newUrls[shortcode];
      setUrls(newUrls);
      storageUtils.saveUrls(newUrls);
      logger.info('URL deleted', { shortcode });
      
      if (selectedUrl && selectedUrl.shortcode === shortcode) {
        setSelectedUrl(null);
      }
    }
  };

  const getTotalStats = () => {
    const urlList = Object.values(urls);
    const totalUrls = urlList.length;
    const totalClicks = urlList.reduce((sum, url) => sum + (url.clicks || 0), 0);
    const customShortcodes = urlList.filter(url => url.customShortcode).length;
    
    return { totalUrls, totalClicks, customShortcodes };
  };

  const stats = getTotalStats();

  if (isLoading) {
    return (
      <div className="stats-page">
        <div className="container">
          <div className="loading">Loading statistics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <div className="container">
        <div className="page-header">
          <h1>URL Statistics</h1>
          <p>Track the performance of your shortened URLs and view detailed analytics.</p>
        </div>

        {Object.keys(urls).length === 0 ? (
          <div className="empty-state">
            <h3>No URLs Found</h3>
            <p>You haven't shortened any URLs yet. <a href="/">Start shortening</a> to see statistics here.</p>
          </div>
        ) : (
          <>
            <div className="stats-overview">
              <div className="stat-card">
                <h3>{stats.totalUrls}</h3>
                <p>Total URLs</p>
              </div>
              <div className="stat-card">
                <h3>{stats.totalClicks}</h3>
                <p>Total Clicks</p>
              </div>
              <div className="stat-card">
                <h3>{stats.customShortcodes}</h3>
                <p>Custom Shortcodes</p>
              </div>
            </div>

            <div className="stats-content">
              <div className="urls-list">
                <h3>All URLs</h3>
                <div className="urls-table">
                  <div className="table-header">
                    <div>Short URL</div>
                    <div>Original URL</div>
                    <div>Clicks</div>
                    <div>Created</div>
                    <div>Actions</div>
                  </div>
                  {Object.entries(urls).map(([shortcode, urlData]) => (
                    <div key={shortcode} className="table-row">
                      <div className="short-url-cell">
                        <span className="short-url">
                          {window.location.origin}/{shortcode}
                        </span>
                        {urlData.customShortcode && (
                          <span className="custom-badge">Custom</span>
                        )}
                      </div>
                      <div className="original-url-cell">
                        <span className="original-url" title={urlData.originalUrl}>
                          {urlData.originalUrl.length > 50 
                            ? `${urlData.originalUrl.substring(0, 50)}...` 
                            : urlData.originalUrl
                          }
                        </span>
                      </div>
                      <div className="clicks-cell">
                        <span className="click-count">{urlData.clicks || 0}</span>
                      </div>
                      <div className="created-cell">
                        <span className="created-date">
                          {urlUtils.formatDate(urlData.createdAt)}
                        </span>
                      </div>
                      <div className="actions-cell">
                        <button
                          onClick={() => handleUrlClick(shortcode)}
                          className="view-btn"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDeleteUrl(shortcode)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedUrl && (
                <div className="url-details">
                  <div className="details-header">
                    <h3>URL Details</h3>
                    <button
                      onClick={() => setSelectedUrl(null)}
                      className="close-btn"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="details-content">
                    <div className="detail-item">
                      <strong>Short URL:</strong>
                      <span>{window.location.origin}/{selectedUrl.shortcode}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Original URL:</strong>
                      <span>{selectedUrl.originalUrl}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Total Clicks:</strong>
                      <span>{selectedUrl.clicks || 0}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Created:</strong>
                      <span>{urlUtils.formatDate(selectedUrl.createdAt)}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Type:</strong>
                      <span>{selectedUrl.customShortcode ? 'Custom Shortcode' : 'Auto-generated'}</span>
                    </div>
                  </div>

                  {selectedUrl.clickHistory && selectedUrl.clickHistory.length > 0 && (
                    <div className="click-history">
                      <h4>Recent Clicks</h4>
                      <div className="clicks-list">
                        {selectedUrl.clickHistory.slice(-10).reverse().map((click, index) => (
                          <div key={index} className="click-item">
                            <div className="click-time">
                              {urlUtils.getTimeAgo(click.timestamp)}
                            </div>
                            <div className="click-details">
                              <div>User Agent: {click.userAgent?.substring(0, 50)}...</div>
                              {click.referrer && (
                                <div>Referrer: {click.referrer}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StatsPage;
