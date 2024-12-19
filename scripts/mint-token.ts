import { Wallet, Provider } from "zksync-ethers";
import * as ethers from "ethers";
import * as hre from "hardhat";
import * as path from "path";
import * as fs from "fs";

import { log, clearLogFile } from "../utils/logger";
import { handleMainError } from "../utils/error-handler";

// Address of the ERC20 token contract
const TOKEN_CONTRACT_ADDRESS = "0xBc16E541aD54cFA402902156d41855F4ecB80730";
// Wallet that will receive tokens
const RECEIVER_WALLET = "0x91D7d1d7dAEB508Bc685fCb55B5bB6b9f5d97054";
// Amount of tokens to mint in ETH format, e.g. 1.23
const TOKEN_AMOUNT = "10";

async function main() {
  // Create logs directory if it doesn't exist
  const logsDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }

  // Clear previous log file
  clearLogFile('mint-token');

  try {
    // Get the provider
    const provider = new Provider("https://sepolia.era.zksync.dev");
    log('mint-token', "Provider initialized");

    // Initialize wallet using private key (you should use env variables in production)
    const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
    const wallet = new Wallet(PRIVATE_KEY, provider);
    log('mint-token', `Using wallet: ${wallet.address}`);

    // Get the contract artifact and create contract instance
    const artifact = await hre.artifacts.readArtifact("FidToken");
    const tokenContract = new ethers.Contract(
      TOKEN_CONTRACT_ADDRESS,
      artifact.abi,
      wallet
    );
    log('mint-token', `Connected to FidToken at ${TOKEN_CONTRACT_ADDRESS}`);

    log('mint-token', "Minting tokens...");

    // Convert token amount to Wei
    const amount = ethers.parseEther(TOKEN_AMOUNT);
    log('mint-token', `Minting ${TOKEN_AMOUNT} tokens to ${RECEIVER_WALLET}`);

    // Mint tokens
    const tx = await tokenContract.mint(
      RECEIVER_WALLET,
      amount
    );
    log('mint-token', `Transaction hash: ${tx.hash}`);

    // Wait for transaction
    const receipt = await tx.wait();
    log('mint-token', `Transaction confirmed in block ${receipt.blockNumber}`);

    // Get new balance
    const balance = await tokenContract.balanceOf(RECEIVER_WALLET);
    log('mint-token', `New balance of ${RECEIVER_WALLET}: ${ethers.formatEther(balance)} FID`);

  } catch (error) {
    log('mint-token', `Error occurred: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

// Use the new error handler
handleMainError(main, 'mint-token');