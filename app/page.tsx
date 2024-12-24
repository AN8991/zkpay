'use client'

import { useState } from 'react'
import { useWeb3 } from 'app/hooks/useWeb3'
import WalletConnect from './components/WalletConnect'
import TokenCreator from './components/TokenCreator'
import TokenMinter from './components/TokenMinter'
import StatusLog from './components/StatusLog'

export default function Home() {
  const { provider, signer, address, connect, disconnect } = useWeb3()
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false })
    setLogs((prevLogs) => [...prevLogs, `[${timestamp}] ${message}`])
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-bold">ZKPay Token Manager</h1>
          <WalletConnect
            address={address}
            onConnect={connect}
            onDisconnect={disconnect}
            addLog={addLog}
          />
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Create New Token</h2>
            <TokenCreator signer={signer} addLog={addLog} />
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Mint Tokens</h2>
            <TokenMinter signer={signer} addLog={addLog} />
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Status Log</h2>
            <StatusLog logs={logs} />
          </div>
        </div>
      </div>
    </main>
  )
}