import { Wallet, utils } from "zksync-ethers";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

// Add function to manage wallet
async function getOrCreateWallet(): Promise<Wallet> {
    const envPath = path.join(process.cwd(), '.env');
    
    // Check for existing private key
    if (process.env.PRIVATE_KEY) {
      console.log("Using existing wallet from PRIVATE_KEY");
      return new Wallet(process.env.PRIVATE_KEY);
    }
  
    // Generate new wallet
    const randomPrivateKey = ethers.Wallet.createRandom().privateKey;
    const randomWallet = new Wallet(randomPrivateKey);
    
    // Append to .env file
    const envContent = `\nPRIVATE_KEY=${randomPrivateKey}`;
    fs.appendFileSync(envPath, envContent);
    
    // Log the new wallet details to console
    console.log("\n=== New Wallet Generated ===");
    console.log(`Address: ${randomWallet.address}`);
    console.log(`Private Key: ${randomPrivateKey}`);
    console.log("WARNING: Make sure to fund this wallet before deployment!");
    console.log("===============================\n");
  
    return randomWallet;
  }

async function deploy(hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for FidToken and zkMessages contracts`);

  const wallet = await getOrCreateWallet();
  const deployer = new Deployer(hre, wallet);
  // TODO: Add a check to ensure the wallet has enough funds
  console.log(`Deploying contracts with wallet: ${wallet.address}`);

  // Deploy FidToken first
  const fidTokenArtifact = await deployer.loadArtifact("FidToken");
  const fidTokenFee = await deployer.estimateDeployFee(fidTokenArtifact, ["FidToken", "FID"]);
  
  console.log(`FidToken deployment estimated to cost ${ethers.formatEther(fidTokenFee.toString())} ETH`);

  const fidToken = await deployer.deploy(fidTokenArtifact, ["FidToken", "FID"]);
  const fidTokenAddress = await fidToken.getAddress();
  console.log(`FidToken was deployed to ${fidTokenAddress}`);

  // Deploy zkMessages with FidToken address as constructor argument
  const zkMessagesArtifact = await deployer.loadArtifact("zkMessages");
  const zkMessagesFee = await deployer.estimateDeployFee(zkMessagesArtifact, []);
  
  console.log(`zkMessages deployment estimated to cost ${ethers.formatEther(zkMessagesFee.toString())} ETH`);

  const zkMessages = await deployer.deploy(zkMessagesArtifact, []);
  const zkMessagesAddress = await zkMessages.getAddress();
  console.log(`zkMessages was deployed to ${zkMessagesAddress}`);

  // Log constructor arguments for verification
  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log(`FidToken: ${fidTokenAddress}`);
  console.log(`zkMessages: ${zkMessagesAddress}`);
}

export default deploy;

module.exports = {
  deploy
};