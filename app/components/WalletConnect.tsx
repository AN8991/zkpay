import React from 'react'
import { ClipboardIcon, ArrowRightIcon as ArrowRightOnRectangleIcon } from 'lucide-react'

// Interface defining the props for the WalletConnect component
// Ensures type safety and clear component requirements
interface WalletConnectProps {
  // Current wallet address (null if not connected)
  address: string | null
  // Async function to handle wallet connection
  onConnect: () => Promise<boolean>
  // Function to handle wallet disconnection
  onDisconnect: () => void
  // Callback function to log messages to parent component
  addLog: (message: string) => void
}

/**
 * WalletConnect Component
 * 
 * Provides a user interface for connecting, disconnecting, and managing a blockchain wallet
 * Handles different UI states based on connection status
 * 
 * @param {WalletConnectProps} props - Component props
 * @returns {React.ReactElement} Rendered wallet connection interface
 */
export default function WalletConnect({ 
  address, 
  onConnect, 
  onDisconnect, 
  addLog 
}: WalletConnectProps) {
  // Handler for wallet connection
  const handleConnect = async () => {
    // Attempt to connect wallet and log result
    const success = await onConnect()
    if (success) {
      // Log successful connection with truncated address
      addLog(`Connected to wallet: ${address}`)
    }
  }

  // Handler for copying wallet address to clipboard
  const handleCopy = () => {
    // Only allow copy if address is available
    if (address) {
      // Use browser clipboard API to copy address
      navigator.clipboard.writeText(address)
      
      // Log clipboard action
      addLog('Wallet address copied to clipboard')
    }
  }

  // Handler for wallet disconnection
  const handleDisconnect = () => {
    // Call disconnect callback
    onDisconnect()
    
    // Log disconnection event
    addLog('Wallet disconnected')
  }

  // Render different UI based on wallet connection status
  if (!address) {
    // Disconnected state: Show connect wallet button
    return (
      <button
        onClick={handleConnect}
        // Tailwind CSS for modern, minimalist button design
        className="bg-black text-white px-4 py-2 rounded-md text-sm"
      >
        Connect Wallet
      </button>
    )
  }

  // Connected state: Show wallet info and action buttons
  return (
    <div 
      // Tailwind CSS for connected wallet container
      // Dark background, white text, flex layout for inline elements
      className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm"
    >
      {/* Display truncated wallet address for readability */}
      <span>Connected: {address.slice(0, 6)}...{address.slice(-4)}</span>
      
      {/* Copy address to clipboard button */}
      <button 
        onClick={handleCopy} 
        // Hover effect for interactive feedback
        className="hover:opacity-75"
        // TODO: Add aria-label for accessibility
      >
        <ClipboardIcon className="h-4 w-4" />
      </button>
      
      {/* Disconnect wallet button */}
      <button 
        onClick={handleDisconnect} 
        // Hover effect for interactive feedback
        className="hover:opacity-75"
        // TODO: Add aria-label for accessibility
      >
        <ArrowRightOnRectangleIcon className="h-4 w-4" />
      </button>
    </div>
  )
}
