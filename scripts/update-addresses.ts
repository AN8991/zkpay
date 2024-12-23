import { readFileSync } from 'fs';
import { updateContractAddresses } from '../utils/update-contract-addresses';
import { log } from '../utils/logger';

async function extractAddressesFromDeployLog() {
  try {
    const logContent = readFileSync('./logs/deploy.log', 'utf8');
    
    // Extract FidToken address
    const fidTokenMatch = logContent.match(/FidToken: (0x[a-fA-F0-9]{40})/);
    const fidTokenAddress = fidTokenMatch ? fidTokenMatch[1] : null;

    // Extract zkMessages address
    const zkMessagesMatch = logContent.match(/zkMessages: (0x[a-fA-F0-9]{40})/);
    const zkMessagesAddress = zkMessagesMatch ? zkMessagesMatch[1] : null;

    if (!fidTokenAddress || !zkMessagesAddress) {
      throw new Error('Could not find contract addresses in deploy.log');
    }

    // Update contract addresses
    updateContractAddresses(fidTokenAddress, zkMessagesAddress);

    log('update-addresses', `Updated addresses:
    - FidToken: ${fidTokenAddress}
    - zkMessages: ${zkMessagesAddress}`);

  } catch (error) {
    log('error', `Failed to update addresses: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

// Run the script
extractAddressesFromDeployLog().catch(console.error);
