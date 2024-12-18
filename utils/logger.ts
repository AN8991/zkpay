import * as fs from 'fs';
import * as path from 'path';

/**
 * Logs a message to console and to a file
 * @param filename Base filename for the log file (without .log extension)
 * @param message Message to log
 */
export function log(filename: string, message: string) {
  // Log to console
  console.log(message);
  
  // Ensure logs directory exists
  const logsDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  // Append to log file
  fs.appendFileSync(
    path.join(logsDir, `${filename}.log`),
    `${new Date().toISOString()} - ${message}\n`
  );
}

/**
 * Clears the log file for a specific script
 * @param filename Base filename for the log file (without .log extension)
 */
export function clearLogFile(filename: string) {
  const logsDir = path.join(__dirname, '../logs');
  const logFilePath = path.join(logsDir, `${filename}.log`);
  
  // Ensure logs directory exists
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  // Clear the log file
  fs.writeFileSync(logFilePath, '');
}
