const browserSync = require('browser-sync');
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create or clear the log file
const logFile = path.join(logsDir, 'browser-console.log');
fs.writeFileSync(logFile, '');

// Initialize Browser-Sync
browserSync.init({
  proxy: 'http://localhost:3000', // Your development server
  files: ['src/**/*.{js,jsx,ts,tsx,css,html}'], // Files to watch
  open: false,
  notify: false,
  ghostMode: false,
  ui: false,
  logLevel: 'debug',
  logFileChanges: true,
  logSnippet: true,
  injectChanges: true,
  middleware: [
    {
      route: '/browser-sync/console-log',
      handle: function (req, res) {
        let body = '';
        req.on('data', function (data) {
          body += data;
        });
        req.on('end', function () {
          try {
            const logData = JSON.parse(body);
            const timestamp = new Date().toISOString();
            const logEntry = `[${timestamp}] [${logData.level}] ${logData.message}\n`;
            
            // Write to log file
            fs.appendFileSync(logFile, logEntry);
            
            // Also output to console
            console.log(logEntry);
          } catch (e) {
            console.error('Error processing log:', e);
          }
        });
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
      }
    }
  ],
  snippetOptions: {
    rule: {
      match: /<\/body>/i,
      fn: function (snippet, match) {
        return `
          <script>
            // Override console methods
            (function() {
              const originalConsole = {
                log: console.log,
                info: console.info,
                warn: console.warn,
                error: console.error,
                debug: console.debug
              };
              
              function sendToServer(level, args) {
                try {
                  const message = Array.from(args).map(arg => {
                    if (typeof arg === 'object') {
                      return JSON.stringify(arg);
                    }
                    return String(arg);
                  }).join(' ');
                  
                  fetch('/browser-sync/console-log', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ level, message })
                  }).catch(err => originalConsole.error('Failed to send log:', err));
                  
                  // Still call the original method
                  originalConsole[level].apply(console, args);
                } catch (e) {
                  originalConsole.error('Error in console override:', e);
                }
              }
              
              // Override console methods
              console.log = function() { sendToServer('log', arguments); };
              console.info = function() { sendToServer('info', arguments); };
              console.warn = function() { sendToServer('warn', arguments); };
              console.error = function() { sendToServer('error', arguments); };
              console.debug = function() { sendToServer('debug', arguments); };
            })();
          </script>
          ${snippet}${match}
        `;
      }
    }
  }
});
