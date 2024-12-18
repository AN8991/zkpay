import { Wallet } from "zksync-ethers";
import * as hre from "hardhat";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

async function main() {
  // Get private key from env
  const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
  // Initialize the wallet
  const wallet = new Wallet(PRIVATE_KEY);
  // Create deployer
  const deployer = new Deployer(hre, wallet);
  
  // Deploy contract
  const artifact = await deployer.loadArtifact("FidToken");
  const fidToken = await deployer.deploy(artifact, ["Fidelity Token", "FID"]);

  console.log(`FidToken deployed to: ${fidToken.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });