// Custom logging utility
import { storageUtils } from './storage';

class Logger {
  constructor() {
    this.levels = {
      ERROR: 'error',
      WARN: 'warn',
      INFO: 'info',
      DEBUG: 'debug'
    };
  }

  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    // Store in localStorage
    storageUtils.addLog(level, message, data);
    
    // For development, also log to console
    if (process.env.NODE_ENV === 'development') {
      switch (level) {
        case this.levels.ERROR:
          console.error(logMessage, data);
          break;
        case this.levels.WARN:
          console.warn(logMessage, data);
          break;
        case this.levels.INFO:
          console.info(logMessage, data);
          break;
        case this.levels.DEBUG:
          console.debug(logMessage, data);
          break;
        default:
          console.log(logMessage, data);
      }
    }
  }

  error(message, data = {}) {
    this.log(this.levels.ERROR, message, data);
  }

  warn(message, data = {}) {
    this.log(this.levels.WARN, message, data);
  }

  info(message, data = {}) {
    this.log(this.levels.INFO, message, data);
  }

  debug(message, data = {}) {
    this.log(this.levels.DEBUG, message, data);
  }
}

export const logger = new Logger();
