/**
 * Custom logger that sends console logs to the IDE via WebSockets
 */

// Define log levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

// Define log entry structure
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  source?: string;
  stack?: string;
}

class Logger {
  private socket: WebSocket | null = null;
  private buffer: LogEntry[] = [];
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor(private serverUrl: string = 'ws://localhost:3310') {
    // Only initialize WebSocket in browser environment
    if (typeof window !== 'undefined') {
      this.connect();
      
      // Override console methods
      this.overrideConsole();
      
      // Handle page unload
      window.addEventListener('beforeunload', () => {
        if (this.socket && this.isConnected) {
          this.socket.close();
        }
      });
    }
  }

  private connect() {
    try {
      this.socket = new WebSocket(this.serverUrl);
      
      this.socket.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        console.log('[Logger] Connected to IDE');
        
        // Send any buffered logs
        if (this.buffer.length > 0) {
          this.buffer.forEach(entry => this.sendToIDE(entry));
          this.buffer = [];
        }
      };
      
      this.socket.onclose = () => {
        this.isConnected = false;
        this.attemptReconnect();
      };
      
      this.socket.onerror = (error) => {
        console.error('[Logger] WebSocket error:', error);
        this.isConnected = false;
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('[Logger] Failed to connect:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      this.reconnectTimeout = setTimeout(() => {
        console.log(`[Logger] Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.connect();
      }, delay);
    }
  }

  private overrideConsole() {
    const originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: console.debug
    };
    
    // Override console.log
    console.log = (...args: any[]) => {
      this.log(LogLevel.INFO, ...args);
      originalConsole.log.apply(console, args);
    };
    
    // Override console.info
    console.info = (...args: any[]) => {
      this.log(LogLevel.INFO, ...args);
      originalConsole.info.apply(console, args);
    };
    
    // Override console.warn
    console.warn = (...args: any[]) => {
      this.log(LogLevel.WARN, ...args);
      originalConsole.warn.apply(console, args);
    };
    
    // Override console.error
    console.error = (...args: any[]) => {
      this.log(LogLevel.ERROR, ...args);
      originalConsole.error.apply(console, args);
    };
    
    // Override console.debug
    console.debug = (...args: any[]) => {
      this.log(LogLevel.DEBUG, ...args);
      originalConsole.debug.apply(console, args);
    };
  }

  private log(level: LogLevel, ...args: any[]) {
    const message = args.map(arg => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg);
        } catch (e) {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      source: this.getCallerInfo()
    };
    
    this.sendToIDE(entry);
  }

  private getCallerInfo(): string {
    try {
      const err = new Error();
      const stack = err.stack || '';
      const stackLines = stack.split('\n');
      
      // Find the first line that's not from this file
      // Skip first 3 lines (Error, getCallerInfo, log)
      for (let i = 3; i < stackLines.length; i++) {
        const line = stackLines[i].trim();
        if (line && !line.includes('logger.ts')) {
          return line;
        }
      }
      
      return '';
    } catch (e) {
      return '';
    }
  }

  private sendToIDE(entry: LogEntry) {
    if (this.socket && this.isConnected) {
      try {
        this.socket.send(JSON.stringify(entry));
      } catch (error) {
        // If sending fails, add to buffer
        this.buffer.push(entry);
      }
    } else {
      // Not connected, add to buffer
      this.buffer.push(entry);
    }
  }

  // Public methods for direct usage
  public debug(...args: any[]) {
    this.log(LogLevel.DEBUG, ...args);
  }

  public info(...args: any[]) {
    this.log(LogLevel.INFO, ...args);
  }

  public warn(...args: any[]) {
    this.log(LogLevel.WARN, ...args);
  }

  public error(...args: any[]) {
    this.log(LogLevel.ERROR, ...args);
  }
}

// Create singleton instance
export const logger = new Logger();

export default logger;
