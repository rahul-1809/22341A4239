// Local storage utilities for URL data management
const STORAGE_KEY = 'affordmed_urls';
const LOGS_KEY = 'affordmed_logs';

export const storageUtils = {
  // Get all stored URLs
  getAllUrls() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading URLs from storage:', error);
      return {};
    }
  },

  // Save URLs to storage
  saveUrls(urls) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
      return true;
    } catch (error) {
      console.error('Error saving URLs to storage:', error);
      return false;
    }
  },

  // Add a new URL
  addUrl(shortcode, urlData) {
    const urls = this.getAllUrls();
    urls[shortcode] = {
      ...urlData,
      createdAt: new Date().toISOString(),
      clicks: 0,
      clickHistory: []
    };
    return this.saveUrls(urls);
  },

  // Get URL by shortcode
  getUrl(shortcode) {
    const urls = this.getAllUrls();
    return urls[shortcode] || null;
  },

  // Update URL data
  updateUrl(shortcode, updates) {
    const urls = this.getAllUrls();
    if (urls[shortcode]) {
      urls[shortcode] = { ...urls[shortcode], ...updates };
      return this.saveUrls(urls);
    }
    return false;
  },

  // Record a click
  recordClick(shortcode, clickData) {
    const urls = this.getAllUrls();
    if (urls[shortcode]) {
      urls[shortcode].clicks += 1;
      urls[shortcode].clickHistory.push({
        timestamp: new Date().toISOString(),
        ...clickData
      });
      return this.saveUrls(urls);
    }
    return false;
  },

  // Check if shortcode exists
  shortcodeExists(shortcode) {
    const urls = this.getAllUrls();
    return shortcode in urls;
  },

  // Get all logs
  getAllLogs() {
    try {
      const data = localStorage.getItem(LOGS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading logs from storage:', error);
      return [];
    }
  },

  // Add a log entry
  addLog(level, message, data = {}) {
    try {
      const logs = this.getAllLogs();
      const logEntry = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        level,
        message,
        data
      };
      logs.push(logEntry);
      
      // Keep only last 1000 logs to prevent storage bloat
      if (logs.length > 1000) {
        logs.splice(0, logs.length - 1000);
      }
      
      localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
      return true;
    } catch (error) {
      console.error('Error saving log:', error);
      return false;
    }
  },

  // Clear all data
  clearAllData() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LOGS_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
};
