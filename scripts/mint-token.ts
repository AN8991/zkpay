import { Wallet, Provider } from "zksync-ethers";
import * as hre from "hardhat";
import { ethers } from "ethers";

// Address of the ERC20 token contract
const TOKEN_CONTRACT_ADDRESS = "0xEFAC725DfC83DEc89ca04B836F925d6cDb82382D";
// Wallet that will receive tokens
const RECEIVER_WALLET = "0x91D7d1d7dAEB508Bc685fCb55B5bB6b9f5d97054";
// Amount of tokens to mint in ETH format, e.g. 1.23
const TOKEN_AMOUNT = "100";

async function main() {
  // Get the provider
  const provider = new Provider("https://sepolia.era.zksync.dev");
  
  // Initialize wallet using private key (you should use env variables in production)
  const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
  const wallet = new Wallet(PRIVATE_KEY, provider);

  // Get the contract artifact and create contract instance
  const artifact = await hre.artifacts.readArtifact("FidToken");
  const tokenContract = new ethers.Contract(
    TOKEN_CONTRACT_ADDRESS,
    artifact.abi,
    wallet
  );

  console.log("Minting tokens...");

  const tx = await tokenContract.mint(
    RECEIVER_WALLET,
    ethers.parseEther(TOKEN_AMOUNT)
  );

  // Wait for transaction to be mined
  await tx.wait();
  
  console.log("Tokens minted successfully!");
  // Log the new balance
  const balance = await tokenContract.balanceOf(RECEIVER_WALLET);
  console.log(`New balance: ${ethers.formatEther(balance)} FID`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });