// URL validation and shortcode generation utilities
import { storageUtils } from './storage';
import { logger } from './logger';

export const urlUtils = {
  // Validate URL format
  isValidUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (error) {
      return false;
    }
  },

  // Normalize URL (add https if no protocol)
  normalizeUrl(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  },

  // Generate random shortcode
  generateShortcode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  },

  // Generate unique shortcode
  async generateUniqueShortcode(length = 6) {
    let attempts = 0;
    const maxAttempts = 100;
    
    while (attempts < maxAttempts) {
      const shortcode = this.generateShortcode(length);
      
      if (!storageUtils.shortcodeExists(shortcode)) {
        logger.info('Generated unique shortcode', { shortcode, attempts: attempts + 1 });
        return shortcode;
      }
      
      attempts++;
    }
    
    // If we can't generate a unique shortcode, use timestamp-based approach
    const timestamp = Date.now().toString(36);
    const randomSuffix = this.generateShortcode(3);
    const fallbackShortcode = `${timestamp}${randomSuffix}`;
    
    logger.warn('Using fallback shortcode generation', { 
      shortcode: fallbackShortcode, 
      attempts 
    });
    
    return fallbackShortcode;
  },

  // Validate custom shortcode
  validateCustomShortcode(shortcode) {
    if (!shortcode || typeof shortcode !== 'string') {
      return { valid: false, error: 'Shortcode is required' };
    }
    
    if (shortcode.length < 3 || shortcode.length > 20) {
      return { valid: false, error: 'Shortcode must be between 3 and 20 characters' };
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(shortcode)) {
      return { valid: false, error: 'Shortcode can only contain letters, numbers, hyphens, and underscores' };
    }
    
    if (storageUtils.shortcodeExists(shortcode)) {
      return { valid: false, error: 'This shortcode is already in use' };
    }
    
    return { valid: true };
  },

  // Get click analytics data
  getClickAnalytics(clickHistory) {
    if (!clickHistory || clickHistory.length === 0) {
      return {
        totalClicks: 0,
        clicksByDay: {},
        clicksByHour: {},
        recentClicks: []
      };
    }

    const analytics = {
      totalClicks: clickHistory.length,
      clicksByDay: {},
      clicksByHour: {},
      recentClicks: clickHistory.slice(-10).reverse()
    };

    clickHistory.forEach(click => {
      const date = new Date(click.timestamp);
      const day = date.toDateString();
      const hour = date.getHours();

      analytics.clicksByDay[day] = (analytics.clicksByDay[day] || 0) + 1;
      analytics.clicksByHour[hour] = (analytics.clicksByHour[hour] || 0) + 1;
    });

    return analytics;
  },

  // Format date for display
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
  },

  // Get time ago string
  getTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }
};
