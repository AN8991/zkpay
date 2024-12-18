require("dotenv").config();
import { HardhatUserConfig, task } from "hardhat/config";
import "@typechain/hardhat";
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";

// Add this task definition
task("deploy", "Deploys the contracts", async (taskArgs, hre) => {
  const deployFn = require("./deploy/deploy");
  await deployFn(hre);
});

// Verify that your .env file is being loaded correctly for the Private Key. 
if (!process.env.PRIVATE_KEY) {
  throw new Error("Please set your PRIVATE_KEY in a .env file");
}

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      zksync: true,
    },
    zkSyncTestnet: {
      url: process.env.ZKSYNC_TESTNET,
      ethNetwork: "sepolia",
      zksync: true,
    },
  },
  solidity: {
    version: "0.8.20",
  },
};

export default config;