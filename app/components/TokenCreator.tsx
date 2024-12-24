import { useState } from 'react'
import { ethers } from 'ethers'

// Define the props interface for type safety and clear component requirements
interface TokenCreatorProps {
  // Ethers signer for contract deployment - can be null if not connected
  signer: ethers.Signer | null
  // Callback function to log messages to parent component
  addLog: (message: string) => void
}

export default function TokenCreator({ signer, addLog }: TokenCreatorProps) {
  // State hooks to manage form inputs and creation process
  // Token name input state
  const [name, setName] = useState('')
  // Token symbol input state  
  const [symbol, setSymbol] = useState('')
  // Loading state to prevent multiple simultaneous deployments
  const [isCreating, setIsCreating] = useState(false)

  // Async handler for token creation
  const handleCreate = async () => {
    // Validate inputs: ensure signer is available and inputs are not empty
    if (!signer || !name || !symbol) return

    // Set creating state to disable button and show loading
    setIsCreating(true)
    try {
      // TODO: Replace hardcoded ABI and bytecode with actual contract artifacts
      // Create a contract factory with minimal ABI, placeholder bytecode, and signer
      const TokenFactory = new ethers.ContractFactory(
        // Minimal ABI specifying constructor signature
        ['constructor(string memory name, string memory symbol)'],
        // CRITICAL: Replace with actual compiled contract bytecode
        '60806040...',  // Placeholder bytecode - MUST be replaced
        signer
      )

      // Deploy the token contract with name and symbol
      // NOTE: This will trigger a blockchain transaction
      const token = await TokenFactory.deploy(name, symbol)
      
      // Wait for contract to be fully deployed
      await token.deploymentTransaction()?.wait()

      // Log successful token creation with details
      addLog(`Token created: ${name} (${symbol}) at ${(token as any).address}`)
      
      // Reset form inputs after successful creation
      setName('')
      setSymbol('')
    } catch (error) {
      // Log and display any errors during token creation
      console.error('Failed to create token:', error)
      addLog('Failed to create token')
    } finally {
      // Ensure creating state is reset even if an error occurs
      setIsCreating(false)
    }
  }

  return (
    // Tailwind CSS for responsive and clean UI
    <div className="space-y-4">
      {/* Token Name Input */}
      <input
        type="text"
        placeholder="Token Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
        // TODO: Add aria labels and form validation
      />
      
      {/* Token Symbol Input */}
      <input
        type="text"
        placeholder="Token Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
        // TODO: Add input length and character restrictions
      />
      
      {/* Token Creation Button */}
      <button
        onClick={handleCreate}
        // Disable button when creating or inputs are empty
        disabled={isCreating || !name || !symbol}
        className="w-full bg-black text-white py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCreating ? 'Creating...' : 'Create Token'}
      </button>
    </div>
  )
}