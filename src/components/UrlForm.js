import React, { useState } from 'react';
import { urlUtils } from '../utils/urlUtils';
import { storageUtils } from '../utils/storage';
import { logger } from '../utils/logger';

const UrlForm = ({ onUrlAdded }) => {
  const [urls, setUrls] = useState([{ url: '', customShortcode: '', validityMinutes: 30 }]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { url: '', customShortcode: '', validityMinutes: 30 }]);
    }
  };

  const removeUrlField = (index) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
      const newErrors = { ...errors };
      delete newErrors[`url_${index}`];
      delete newErrors[`shortcode_${index}`];
      delete newErrors[`validity_${index}`];
      setErrors(newErrors);
    }
  };

  const updateUrl = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);

    // Clear error when user starts typing
    const newErrors = { ...errors };
    delete newErrors[`${field}_${index}`];
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    urls.forEach((urlData, index) => {
      if (!urlData.url.trim()) {
        newErrors[`url_${index}`] = 'URL is required';
        isValid = false;
      } else if (!urlUtils.isValidUrl(urlUtils.normalizeUrl(urlData.url))) {
        newErrors[`url_${index}`] = 'Please enter a valid URL';
        isValid = false;
      }

      if (urlData.customShortcode.trim()) {
        const validation = urlUtils.validateCustomShortcode(urlData.customShortcode);
        if (!validation.valid) {
          newErrors[`shortcode_${index}`] = validation.error;
          isValid = false;
        }
      }

      // Validate validity period
      const validityMinutes = parseInt(urlData.validityMinutes);
      if (isNaN(validityMinutes) || validityMinutes < 1 || validityMinutes > 10080) { // Max 7 days
        newErrors[`validity_${index}`] = 'Validity must be between 1 and 10080 minutes (7 days)';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      logger.warn('Form validation failed', { errors });
      return;
    }

    setIsSubmitting(true);
    const results = [];

    try {
      for (let i = 0; i < urls.length; i++) {
        const urlData = urls[i];
        if (!urlData.url.trim()) continue;

        const normalizedUrl = urlUtils.normalizeUrl(urlData.url);
        const shortcode = urlData.customShortcode.trim() || await urlUtils.generateUniqueShortcode();
        
        // Calculate expiry date (30 minutes default if not specified)
        const validityMinutes = parseInt(urlData.validityMinutes) || 30;
        const expiresAt = new Date(Date.now() + validityMinutes * 60 * 1000);
        
        const urlInfo = {
          originalUrl: normalizedUrl,
          shortcode,
          customShortcode: urlData.customShortcode.trim() !== '',
          validityMinutes,
          expiresAt: expiresAt.toISOString()
        };

        const success = storageUtils.addUrl(shortcode, urlInfo);
        
        if (success) {
          results.push({
            ...urlInfo,
            shortUrl: `${window.location.origin}/${shortcode}`,
            success: true
          });
          logger.info('URL shortened successfully', { shortcode, originalUrl: normalizedUrl });
        } else {
          results.push({
            originalUrl: normalizedUrl,
            shortcode,
            success: false,
            error: 'Failed to save URL'
          });
          logger.error('Failed to save URL', { shortcode, originalUrl: normalizedUrl });
        }
      }

      onUrlAdded(results);
      
      // Reset form
      setUrls([{ url: '', customShortcode: '', validityMinutes: 30 }]);
      setErrors({});
      
    } catch (error) {
      logger.error('Error processing URLs', { error: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="url-form">
      <div className="form-header">
        <h2>Shorten Your URLs</h2>
        <p>Enter up to 5 URLs to shorten. Custom shortcodes are optional.</p>
      </div>

      <div className="url-inputs">
        {urls.map((urlData, index) => (
          <div key={index} className="url-input-group">
            <div className="input-row">
              <div className="input-group">
                <label htmlFor={`url_${index}`}>URL {index + 1}</label>
                <input
                  type="url"
                  id={`url_${index}`}
                  value={urlData.url}
                  onChange={(e) => updateUrl(index, 'url', e.target.value)}
                  placeholder="https://example.com"
                  className={errors[`url_${index}`] ? 'error' : ''}
                />
                {errors[`url_${index}`] && (
                  <span className="error-message">{errors[`url_${index}`]}</span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor={`shortcode_${index}`}>Custom Shortcode (optional)</label>
                <input
                  type="text"
                  id={`shortcode_${index}`}
                  value={urlData.customShortcode}
                  onChange={(e) => updateUrl(index, 'customShortcode', e.target.value)}
                  placeholder="my-custom-code"
                  className={errors[`shortcode_${index}`] ? 'error' : ''}
                />
                {errors[`shortcode_${index}`] && (
                  <span className="error-message">{errors[`shortcode_${index}`]}</span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor={`validity_${index}`}>Validity Period (minutes)</label>
                <input
                  type="number"
                  id={`validity_${index}`}
                  value={urlData.validityMinutes}
                  onChange={(e) => updateUrl(index, 'validityMinutes', e.target.value)}
                  placeholder="30"
                  min="1"
                  max="10080"
                  className={errors[`validity_${index}`] ? 'error' : ''}
                />
                {errors[`validity_${index}`] && (
                  <span className="error-message">{errors[`validity_${index}`]}</span>
                )}
              </div>

              {urls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeUrlField(index)}
                  className="remove-btn"
                  title="Remove this URL"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="form-actions">
        {urls.length < 5 && (
          <button
            type="button"
            onClick={addUrlField}
            className="add-url-btn"
          >
            + Add Another URL
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-btn"
        >
          {isSubmitting ? 'Shortening...' : 'Shorten URLs'}
        </button>
      </div>
    </form>
  );
};

export default UrlForm;
