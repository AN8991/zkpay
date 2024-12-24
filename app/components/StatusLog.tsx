import React from 'react'

// Interface defining the props for the StatusLog component
// Ensures type safety and clear component requirements
interface StatusLogProps {
  // Array of log messages to be displayed
  logs: string[]
}

/**
 * StatusLog Component
 * 
 * Displays a scrollable log of activities or messages
 * Uses a monospaced font for better readability of technical logs
 * Provides a fallback message when no logs are present
 * 
 * @param {StatusLogProps} props - Component props
 * @returns {React.ReactElement} Rendered status log component
 */
export default function StatusLog({ logs }: StatusLogProps) {
  return (
    // Tailwind CSS classes for styling the log container
    // - Light gray background for subtle contrast
    // - Rounded corners for modern look
    // - Fixed height with vertical scrolling
    // - Monospaced font for consistent log display
    <div className="bg-[#f8f8f8] rounded-md p-4 h-48 overflow-y-auto font-mono text-sm">
      {/* Map through logs and render each log entry */}
      {logs.map((log, index) => (
        // Use index as key (not recommended for dynamic lists, but okay for logs)
        // Add margin between log entries for readability
        <div key={index} className="mb-1">
          {log}
        </div>
      ))}

      {/* Render a placeholder when no logs are available */}
      {logs.length === 0 && (
        <div className="text-gray-400">No activity to show</div>
      )}
    </div>
  )
}