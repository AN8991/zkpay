import { Router } from 'express';
import { ethers } from 'ethers';
import { getProvider } from '../utils/provider';

const router = Router();
const explorerUrl = process.env.EXPLORER_URL || 'https://sepolia.explorer.zksync.io';

/**
 * @swagger
 * /api/wallet/balance/{address}:
 *   get:
 *     summary: Get wallet balance in ETH
 *     tags: [Wallet]
 *     parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: Ethereum wallet address
 *     responses:
 *       200:
 *         description: Returns the wallet balance in ETH
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: string
 *                 explorerUrl:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.get('/balance/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const provider = getProvider();
        const balance = await provider.getBalance(address);
        res.json({ 
            balance: ethers.formatEther(balance),
            explorerUrl: `${explorerUrl}/address/${address}`
        });
    } catch (error: any) {
        console.error('Error getting wallet balance:', error);
        res.status(500).json({ 
            error: 'Failed to get wallet balance',
            details: error.message 
        });
    }
});

/**
 * @swagger
 * /api/wallet/tx/{hash}:
 *   get:
 *     summary: Get transaction details
 *     tags: [Wallet]
 *     parameters:
 *       - in: path
 *         name: hash
 *         schema:
 *           type: string
 *         required: true
 *         description: Transaction hash
 *     responses:
 *       200:
 *         description: Returns the transaction details
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
router.get('/tx/:hash', async (req, res) => {
    try {
        const { hash } = req.params;
        const provider = getProvider();
        const tx = await provider.getTransaction(hash);
        if (!tx) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Get block information to get timestamp
        const block = tx.blockNumber ? await provider.getBlock(tx.blockNumber) : null;
        
        // Convert BigInt values to strings and ensure proper serialization
        const serializedTx = {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value?.toString(),
            nonce: tx.nonce?.toString(),
            gasLimit: tx.gasLimit?.toString(),
            gasPrice: tx.gasPrice?.toString(),
            data: tx.data,
            chainId: tx.chainId?.toString(),
            blockNumber: tx.blockNumber?.toString(),
            blockHash: tx.blockHash,
            timestamp: block ? block.timestamp.toString() : undefined,
            explorerUrl: `${explorerUrl}/tx/${hash}`
        };

        res.json(serializedTx);
    } catch (error: any) {
        console.error('Error getting transaction:', error);
        res.status(500).json({ 
            error: 'Failed to get transaction',
            details: error.message 
        });
    }
});

/**
 * @swagger
 * /api/wallet/contract/deployment/{address}:
 *   get:
 *     summary: Get all contracts deployed by a wallet
 *     tags: [Wallet]
 *     parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: Wallet address to check deployments
 *     responses:
 *       200:
 *         description: Returns list of deployed contract addresses
 *       500:
 *         description: Server error
 */
router.get('/contract/deployment/:address', async (req, res) => {
    try {
        const { address } = req.params;
        
        // Use zkSync Era Testnet API for Sepolia
        const apiUrl = 'https://block-explorer-api.sepolia.zksync.dev';
        const response = await fetch(
            `${apiUrl}/api?module=account&action=txlist&address=${address}&txtype=contract_deployment`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch from zkSync API');
        }
        
        const data = await response.json();
        console.log('API Response:', JSON.stringify(data, null, 2));
        
        if (!data.result) {
            return res.json({ 
                address,
                totalDeployments: 0,
                deployments: []
            });
        }
        
        const deployments = Array.isArray(data.result) ? data.result.map((deployment: any) => ({
            contractAddress: deployment.contractAddress,
            transactionHash: deployment.hash,
            blockNumber: parseInt(deployment.blockNumber),
            timestamp: parseInt(deployment.timestamp),
            explorerUrl: `${explorerUrl}/tx/${deployment.hash}`
        })) : [];
        
        res.json({ 
            address,
            totalDeployments: deployments.length,
            deployments: deployments.sort((a: { blockNumber: number }, b: { blockNumber: number }) => b.blockNumber - a.blockNumber) // Sort by most recent first
        });
    } catch (error: any) {
        console.error('Error getting contract deployments:', error);
        res.status(500).json({ 
            error: 'Failed to get contract deployments',
            details: error.message 
        });
    }
});

export default router;
