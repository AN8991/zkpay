import { useState, useEffect, useCallback } from 'react'
import { ethers, BrowserProvider, JsonRpcSigner } from 'ethers'

export function useWeb3() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [address, setAddress] = useState<string | null>(null)

  const connect = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        setProvider(provider)
        setSigner(signer)
        setAddress(address)
        return true
      } catch (error) {
        console.error('Failed to connect:', error)
        return false
      }
    } else {
      console.error('Metamask not detected')
      return false
    }
  }, [])

  const disconnect = useCallback(() => {
    setProvider(null)
    setSigner(null)
    setAddress(null)
  }, [])

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', () => {
        disconnect()
      })
    }
    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeAllListeners()
      }
    }
  }, [disconnect])

  return { provider, signer, address, connect, disconnect }
}
