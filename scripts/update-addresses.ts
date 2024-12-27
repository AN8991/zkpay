import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import { log } from '../utils/logger';

async function extractAddressesFromDeployLog() {
  try {
    const logContent = readFileSync('./logs/deploy.log', 'utf8');
    
    // Extract FidToken address
    const fidTokenMatch = logContent.match(/FidToken was deployed to (0x[a-fA-F0-9]{40})/);
    const fidTokenAddress = fidTokenMatch ? fidTokenMatch[1] : null;

    // Extract zkMessages address
    const zkMessagesMatch = logContent.match(/zkMessages was deployed to (0x[a-fA-F0-9]{40})/);
    const zkMessagesAddress = zkMessagesMatch ? zkMessagesMatch[1] : null;

    // Extract wallet address
    const walletMatch = logContent.match(/Using wallet address: (0x[a-fA-F0-9]{40})/);
    const walletAddress = walletMatch ? walletMatch[1] : null;

    if (!fidTokenAddress || !zkMessagesAddress || !walletAddress) {
      throw new Error('Could not find contract addresses in deploy.log');
    }

    // Update contract addresses
    updateContractAddresses(fidTokenAddress, zkMessagesAddress, walletAddress);

    log('update-addresses', `Updated addresses:
    - FidToken: ${fidTokenAddress}
    - zkMessages: ${zkMessagesAddress}
    - Wallet: ${walletAddress}`);

  } catch (error) {
    log('error', `Failed to update addresses: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

function updateContractAddresses(fidTokenAddress: string, zkMessagesAddress: string, walletAddress: string) {
  const projectRoot = process.cwd();

  // Update mint-token.ts
  const mintTokenPath = path.join(projectRoot, 'scripts', 'mint-token.ts');
  let mintTokenContent = readFileSync(mintTokenPath, 'utf8');
  mintTokenContent = mintTokenContent.replace(
    /const TOKEN_CONTRACT_ADDRESS = ".*";/,
    `const TOKEN_CONTRACT_ADDRESS = "${fidTokenAddress}";`
  );
  writeFileSync(mintTokenPath, mintTokenContent);

  // Update paymaster-transaction.ts
  const paymasterTransactionPath = path.join(projectRoot, 'scripts', 'paymaster-transaction.ts');
  let paymasterTransactionContent = readFileSync(paymasterTransactionPath, 'utf8');
  paymasterTransactionContent = paymasterTransactionContent.replace(
    /const ZKMESSAGES_ADDRESS = ".*";/,
    `const ZKMESSAGES_ADDRESS = "${zkMessagesAddress}";`
  );
  paymasterTransactionContent = paymasterTransactionContent.replace(
    /const FIDTOKEN_ADDRESS = ".*";/,
    `const FIDTOKEN_ADDRESS = "${fidTokenAddress}";`
  );
  writeFileSync(paymasterTransactionPath, paymasterTransactionContent);

  // Update .env file
  const envPath = path.join(projectRoot, '.env');
  let envContent = readFileSync(envPath, 'utf8');
  
  // Update Wallet Address
  envContent = envContent.replace(
    /WALLET_ADDRESS=.*(\s|$)/,
    `WALLET_ADDRESS=${walletAddress}\n`
  );
    
  // Update ZKMESSAGES_ADDRESS
  envContent = envContent.replace(
    /ZKMESSAGES_ADDRESS=.*(\s|$)/,
    `ZKMESSAGES_ADDRESS=${zkMessagesAddress}\n`
  );
  
  // Update FIDTOKEN_ADDRESS
  envContent = envContent.replace(
    /FIDTOKEN_ADDRESS=.*(\s|$)/,
    `FIDTOKEN_ADDRESS=${fidTokenAddress}\n`
  );
  
  writeFileSync(envPath, envContent);
}

// Run the script
extractAddressesFromDeployLog().catch(console.error);