/**
 * Handles errors for main async functions, providing consistent error logging and exit
 * @param mainFn Async function to execute
 * @param logFilename Optional log filename for error logging
 */
export function handleMainError(
  mainFn: () => Promise<void>, 
  logFilename?: string
) {
  mainFn()
    .then(() => process.exit(0))
    .catch((error) => {
      // Log error to console
      console.error('Execution failed:', error);
      
      // Optionally log to file if filename provided
      if (logFilename) {
        try {
          const { log } = require('./logger');
          log(logFilename, `Error: ${error instanceof Error ? error.message : String(error)}`);
        } catch (logError) {
          console.error('Failed to log error:', logError);
        }
      }
      
      // Exit with error code
      process.exit(1);
    });
}
