/**
 * Centralized logging utility
 * Provides structured logging with levels and timestamps
 * 
 * Usage:
 *   import { Logger } from '../../../shared/logger';
 *   Logger.info('Navigation complete', { url: 'https://example.com' });
 *   Logger.error('Test failed', error);
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export class Logger {
  private static level: LogLevel = LogLevel.INFO;
  private static enableColors = true;

  static setLevel(level: LogLevel): void {
    this.level = level;
  }

  static setColors(enabled: boolean): void {
    this.enableColors = enabled;
  }

  static debug(message: string, data?: any): void {
    if (this.level <= LogLevel.DEBUG) {
      console.log(this.format('DEBUG', message, data, '\x1b[36m')); // Cyan
    }
  }

  static info(message: string, data?: any): void {
    if (this.level <= LogLevel.INFO) {
      console.log(this.format('INFO', message, data, '\x1b[32m')); // Green
    }
  }

  static warn(message: string, data?: any): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(this.format('WARN', message, data, '\x1b[33m')); // Yellow
    }
  }

  static error(message: string, error?: Error | any): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(this.format('ERROR', message, error, '\x1b[31m')); // Red
    }
  }

  private static format(level: string, message: string, data?: any, color?: string): string {
    const timestamp = new Date().toISOString();
    const reset = '\x1b[0m';
    const colorPrefix = this.enableColors && color ? color : '';
    const colorSuffix = this.enableColors && color ? reset : '';
    
    let dataStr = '';
    if (data) {
      if (data instanceof Error) {
        dataStr = ` | Error: ${data.message}${data.stack ? '\n' + data.stack : ''}`;
      } else if (typeof data === 'object') {
        try {
          dataStr = ` | ${JSON.stringify(data)}`;
        } catch {
          dataStr = ` | [Complex Object]`;
        }
      } else {
        dataStr = ` | ${data}`;
      }
    }
    
    return `${colorPrefix}[${level}]${colorSuffix} ${timestamp} - ${message}${dataStr}`;
  }
}

// Set level from environment
const envLevel = process.env.LOG_LEVEL?.toUpperCase();
if (envLevel && LogLevel[envLevel as keyof typeof LogLevel] !== undefined) {
  Logger.setLevel(LogLevel[envLevel as keyof typeof LogLevel]);
}

// Disable colors in CI environments
if (process.env.CI) {
  Logger.setColors(false);
}

export default Logger;
