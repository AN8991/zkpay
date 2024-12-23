import { ethers } from 'ethers';

// Cache provider instance
let providerInstance: ethers.JsonRpcProvider | null = null;
let walletInstance: ethers.Wallet | null = null;

export function getProvider() {
    if (providerInstance) {
        return providerInstance;
    }

    const rpcUrl = process.env.RPC_URL;
    if (!rpcUrl) {
        throw new Error('RPC_URL not configured');
    }
    providerInstance = new ethers.JsonRpcProvider(rpcUrl);
    return providerInstance;
}

export function getWallet() {
    if (walletInstance) {
        return walletInstance;
    }

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        throw new Error('PRIVATE_KEY not configured');
    }
    const provider = getProvider();
    walletInstance = new ethers.Wallet(privateKey, provider);
    return walletInstance;
}
