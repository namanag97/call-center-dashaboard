const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Configuration
const PORT = process.env.LOG_SERVER_PORT || 3310;
const LOG_FILE = path.join(__dirname, 'logs', 'browser-console.log');

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create or clear the log file
fs.writeFileSync(LOG_FILE, '');

// Create WebSocket server
const wss = new WebSocket.Server({ port: PORT });

console.log(chalk.green(`[IDE Logger] WebSocket server started on port ${PORT}`));
console.log(chalk.green(`[IDE Logger] Logs will be saved to ${LOG_FILE}`));

// Handle connections
wss.on('connection', (ws) => {
  console.log(chalk.blue('[IDE Logger] Browser connected'));
  
  ws.on('message', (message) => {
    try {
      const logEntry = JSON.parse(message);
      
      // Format the log entry
      const timestamp = chalk.gray(`[${logEntry.timestamp}]`);
      
      let levelColor;
      switch (logEntry.level) {
        case 'debug':
          levelColor = chalk.cyan(`[${logEntry.level.toUpperCase()}]`);
          break;
        case 'info':
          levelColor = chalk.blue(`[${logEntry.level.toUpperCase()}]`);
          break;
        case 'warn':
          levelColor = chalk.yellow(`[${logEntry.level.toUpperCase()}]`);
          break;
        case 'error':
          levelColor = chalk.red(`[${logEntry.level.toUpperCase()}]`);
          break;
        default:
          levelColor = chalk.white(`[${logEntry.level.toUpperCase()}]`);
      }
      
      const source = logEntry.source ? chalk.gray(logEntry.source) : '';
      
      // Log to console
      console.log(`${timestamp} ${levelColor} ${logEntry.message} ${source}`);
      
      // Write to file (without colors)
      const fileEntry = `[${logEntry.timestamp}] [${logEntry.level.toUpperCase()}] ${logEntry.message} ${logEntry.source || ''}\n`;
      fs.appendFileSync(LOG_FILE, fileEntry);
      
    } catch (error) {
      console.error(chalk.red('[IDE Logger] Error processing message:'), error);
    }
  });
  
  ws.on('close', () => {
    console.log(chalk.yellow('[IDE Logger] Browser disconnected'));
  });
});

// Handle server errors
wss.on('error', (error) => {
  console.error(chalk.red('[IDE Logger] Server error:'), error);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n[IDE Logger] Shutting down...'));
  wss.close();
  process.exit(0);
});
