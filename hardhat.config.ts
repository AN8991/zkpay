import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@matterlabs/hardhat-zksync-node";
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";
import "dotenv/config";

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
  defaultNetwork: "zkSyncTestnet",
  
  networks: {
    hardhat: {
      zksync: true,
    },
    zkSyncTestnet: {
      url: process.env.ZKSYNC_TESTNET || "https://sepolia.era.zksync.dev",
      ethNetwork: "sepolia",
      zksync: true,
      verifyURL: "https://sepolia-explorer.zksync.io/contract_verification",
      chainId: 300,
    },
    zkSyncMainnet: {
      url: process.env.ZKSYNC_MAINNET || "https://mainnet.era.zksync.io",
      ethNetwork: "mainnet",
      zksync: true,
      verifyURL: "https://zksync-era.l2scan.co/contract_verification",
      chainId: 324,
    },
  },

  // Specify the Solidity compiler version
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  // zkSync compiler configuration
  zksolc: {
    settings: {
      libraries: {}, // Optional: external libraries
    },
  },

  // TypeChain configuration
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },

  // Add ZKSync verification configuration
  etherscan: {
    apiKey: {
      zkSyncTestnet: process.env.ZKSYNC_EXPLORER_API_KEY || "",
      zkSyncMainnet: process.env.ZKSYNC_EXPLORER_API_KEY || "",
    },
    customChains: [
      {
        network: "zkSyncTestnet",
        chainId: 300,
        urls: {
          apiURL: "https://sepolia-explorer.zksync.io/contract_verification",
          browserURL: "https://sepolia.explorer.zksync.io"
        }
      },
      {
        network: "zkSyncMainnet",
        chainId: 324,
        urls: {
          apiURL: "https://zksync-era.l2scan.co/contract_verification",
          browserURL: "https://explorer.zksync.io"
        }
      }
    ]
  },
};

export default config;