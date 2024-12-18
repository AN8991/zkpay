require("dotenv").config();
require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-solc");
require("@matterlabs/hardhat-zksync-verify");
import { HardhatUserConfig, task } from "hardhat/config";

// Add this task definition
task("deploy", "Deploys the contracts", async (taskArgs, hre) => {
  const { deploy } = require("./deploy/deploy.ts");
  await deploy(hre);
});

// Verify that your .env file is being loaded correctly for the Private Key. 
if (!process.env.PRIVATE_KEY) {
  throw new Error("Please set your PRIVATE_KEY in a .env file");
}

const config: HardhatUserConfig = {
  zksolc: {
    version: "1.5.8",
    compilerSource: "binary",
    settings: {},
  },
  defaultNetwork: "zkSyncTestnet",
  networks: {
    hardhat: {
      zksync: true,
    },
    zkSyncTestnet: {
      url: process.env.ZKSYNC_TESTNET,
      ethNetwork: "sepolia",
      zksync: true,
      verifyURL: "https://sepolia.era.zksync.dev",
    },
  },
  solidity: {
    version: "0.8.20",
  },
};

export default config;