import { Wallet, Provider } from "zksync-ethers";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

import { log, clearLogFile } from "../utils/logger";
import { handleMainError } from "../utils/error-handler";

dotenv.config();

// Add function to manage wallet
async function getOrCreateWallet(): Promise<Wallet> {
    const envPath = path.join(process.cwd(), '.env');
    
    // Check for existing private key if provided for wallet creation
    if (process.env.PRIVATE_KEY) {
      log('deploy', "Using existing wallet from PRIVATE_KEY");
      // Initialize zkSync provider
      const provider = new Provider(process.env.ZKSYNC_TESTNET);
      return new Wallet(process.env.PRIVATE_KEY, provider);
    }
  
    // Generate new wallet if there is no existing private key
    const randomWallet = Wallet.createRandom();
    const randomPrivateKey = randomWallet.privateKey;
    const provider = new Provider(process.env.ZKSYNC_TESTNET);
    const randomWalletInstance = new Wallet(randomPrivateKey, provider);
    
    // Append the key to .env file
    const envContent = `\nPRIVATE_KEY=${randomPrivateKey}`;
    fs.appendFileSync(envPath, envContent);
    
    // Log the new wallet details
    log('deploy', "\n=== New Wallet Generated ===");
    log('deploy', `Address: ${randomWallet.address}`);
    log('deploy', `Private Key: ${randomPrivateKey}`);
    log('deploy', "WARNING: Make sure to fund this wallet before deployment!");
    log('deploy', "===============================\n");
  
    return randomWalletInstance;
  }

// Deploy function for direct calls. Ex-CLI
async function deploy(hre: HardhatRuntimeEnvironment) {
  // Clear previous log file
  clearLogFile('deploy');

  log('deploy', "Starting deployment process...");
  try {
    log('deploy', `Running deploy script for FidToken and zkMessages contracts`);

    // Get the wallet details
    const wallet = await getOrCreateWallet();
    log('deploy', `Using wallet address: ${wallet.address}`);
    
    // Create deployer
    const deployer = new Deployer(hre, wallet);
    log('deploy', "Deployer initialized");
    
    // Check creator wallet balance
    const balance = await wallet.getBalance();
    log('deploy', `Wallet balance: ${ethers.formatEther(balance)} ETH`);
    
    if (balance.toString() === '0') {
      throw new Error('Wallet has zero balance');
    }

    log('deploy', `Deploying contracts with wallet: ${wallet.address}`);

    // Load artifacts with FidToken
    const fidTokenArtifact = await deployer.loadArtifact("FidToken");
    const fidTokenFee = await deployer.estimateDeployFee(fidTokenArtifact, ["FidToken", "FID"]);

    log('deploy', `FidToken deployment estimated to cost ${ethers.formatEther(fidTokenFee.toString())} ETH`);

    const fidTokenContract = await deployer.deploy(fidTokenArtifact, ["FidToken", "FID"]);
    const fidTokenAddress = await fidTokenContract.getAddress();

    log('deploy', `FidToken was deployed to ${fidTokenAddress}`);

    // Deploy zkMessages
    const zkMessagesArtifact = await deployer.loadArtifact("zkMessages");
    const zkMessagesFee = await deployer.estimateDeployFee(zkMessagesArtifact, [fidTokenAddress]);

    log('deploy', `zkMessages deployment estimated to cost ${ethers.formatEther(zkMessagesFee.toString())} ETH`);

    const zkMessagesContract = await deployer.deploy(zkMessagesArtifact, [fidTokenAddress]);
    const zkMessagesAddress = await zkMessagesContract.getAddress();

    log('deploy', `zkMessages was deployed to ${zkMessagesAddress}`);

    // Log constructor arguments for verification. This is for internal information
    log('deploy', "\nDeployment Summary:");
    log('deploy', "-------------------");
    log('deploy', `FidToken: ${fidTokenAddress}`);
    log('deploy', `zkMessages: ${zkMessagesAddress}`);
    
    // Save deployment addresses to a file
    const deploymentInfo = {
      network: hre.network.name,
      fidToken: fidTokenAddress,
      zkMessages: zkMessagesAddress,
      deployedAt: new Date().toISOString()
    };

    // Run paymaster transaction script
    const { execSync } = require('child_process');
    try {
      log('deploy', 'Running paymaster transaction script...');
      const paymasterOutput = execSync('npx ts-node scripts/paymaster-transaction.ts', { 
        stdio: 'pipe',
        cwd: path.join(__dirname, '..')
      });
      
      // Log the output of the paymaster transaction script
      log('deploy', `Paymaster Transaction Script Output:\n${paymasterOutput.toString().trim()}`);
      log('deploy', 'Paymaster transaction script executed successfully');
    } catch (error: unknown) {
      if (error instanceof Error) {
        log('error', `Failed to execute paymaster transaction script: ${error.message}`);
        
        // Check if error has stderr property using type assertion
        const errorWithStderr = error as { stderr?: { toString(): string } };
        if (errorWithStderr.stderr) {
          log('error', `Paymaster Transaction Script Error Output:\n${errorWithStderr.stderr.toString().trim()}`);
        }
      } else {
        log('error', `Failed to execute paymaster transaction script: ${String(error)}`);
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      log('error', `Failed to execute deployment: ${error.message}`);
    } else {
      log('error', `Failed to execute deployment: ${String(error)}`);
    }
  }
}

// Export function that Hardhat or other scripts will use for deployment tasks
module.exports = async function(hre: HardhatRuntimeEnvironment) {
  try {
    return await deploy(hre);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(String(error));
    }
  }
};