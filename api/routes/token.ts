import { Router } from 'express';
import { ethers } from 'ethers';
import { getProvider, getWallet } from '../utils/provider';
import FidTokenABI from '../../artifacts-zk/contracts/FidToken.sol/FidToken.json';

const router = Router();
const CONTRACT_ADDRESS = process.env.FIDTOKEN_ADDRESS;

/**
 * @swagger
 * /api/token/tx/{hash}:
 *   get:
 *     summary: Get token transaction details
 *     tags: [Token]
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
 *       500:
 *         description: Server error
 */
router.get('/tx/:hash', async (req, res) => {
    try {
        const { hash } = req.params;
        const provider = getProvider();
        const tx = await provider.getTransaction(hash);
        const receipt = await provider.getTransactionReceipt(hash);
        
        if (!receipt) {
            return res.status(404).json({ error: 'Transaction receipt not found. The transaction may be pending or invalid.' });
        }

        res.json({ transaction: tx, receipt });
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to get transaction', details: error.message });
    }
});

/**
 * @swagger
 * /api/token/tx/gasfeeeth/{hash}:
 *   get:
 *     summary: Get gas fee in ETH for a transaction
 *     tags: [Token]
 *     parameters:
 *       - in: path
 *         name: hash
 *         schema:
 *           type: string
 *         required: true
 *         description: Transaction hash
 *     responses:
 *       200:
 *         description: Returns the gas fee in ETH
 *       500:
 *         description: Server error
 */
router.get('/tx/gasfeeeth/:hash', async (req, res) => {
    try {
        const { hash } = req.params;
        const provider = getProvider();
        const receipt = await provider.getTransactionReceipt(hash);
        
        if (!receipt) {
            return res.status(404).json({ error: 'Transaction receipt not found. The transaction may be pending or invalid.' });
        }

        const gasUsed = receipt.gasUsed;
        const gasPrice = receipt.gasPrice;
        const gasFeeEth = ethers.formatEther(gasUsed * gasPrice);
        res.json({ gasFeeEth });
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to get gas fee', details: error.message });
    }
});

/**
 * @swagger
 * /api/token/tx/gasfeefid/{hash}:
 *   get:
 *     summary: Get total fee paid in FidToken
 *     tags: [Token]
 *     parameters:
 *       - in: path
 *         name: hash
 *         schema:
 *           type: string
 *         required: true
 *         description: Transaction hash
 *     responses:
 *       200:
 *         description: Returns the fee paid in FidToken
 *       500:
 *         description: Server error
 */
router.get('/tx/gasfeefid/:hash', async (req, res) => {
    try {
        const { hash } = req.params;
        const provider = getProvider();
        const receipt = await provider.getTransactionReceipt(hash);
        
        if (!receipt) {
            return res.status(404).json({ error: 'Transaction receipt not found. The transaction may be pending or invalid.' });
        }

        // Look for FidToken transfer events in the logs
        if (!CONTRACT_ADDRESS) {
            return res.status(500).json({ error: 'Token contract address not configured' });
        }
        const contract = new ethers.Contract(CONTRACT_ADDRESS, FidTokenABI.abi, provider);
        const transferEvents = receipt.logs
            .filter(log => log.address.toLowerCase() === CONTRACT_ADDRESS.toLowerCase())
            .map(log => {
                try {
                    return contract.interface.parseLog(log);
                } catch (e) {
                    return null;
                }
            })
            .filter(event => event && event.name === 'Transfer');
            
        const totalFidFee = transferEvents.reduce((sum, event) => {
            return sum + (event ? BigInt(event.args.value.toString()) : BigInt(0));
        }, BigInt(0));
        
        res.json({ feePaidInFidToken: totalFidFee.toString() });
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to get FidToken fee', details: error.message });
    }
});

export default router;
