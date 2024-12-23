# ZkSync Smart Contract Project

## Prerequisites
- Node.js v18+ 
- npm or yarn

## Sepolia testnet network details
https://docs.zksync.io/zksync-era/environment

## Dependencies
NOTE: 
1. There are dependency issues if you try and install npm packages directly due to conflicts between openzeppelin and matterlabs.
2. The --legacy-peer-deps flag will allow npm to install packages with conflicting peer dependencies, which is necessary in this case.
3. There is an optional step at the end of the file for contract verification.


## Installation

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/AN8991/zkpay.git
cd zkpay
```

```bash
npm install --save-dev --legacy-peer-deps "@nomicfoundation/hardhat-chai-matchers@^2.0.0" "@nomicfoundation/hardhat-ethers@^3.0.0" "@nomicfoundation/hardhat-ignition-ethers@^0.15.0" "@nomicfoundation/hardhat-network-helpers@^1.0.0" "@typechain/ethers-v6@^0.5.0" "@typechain/hardhat@^9.0.0" "@types/chai@^4.2.0" "@types/mocha@>=9.1.0" "hardhat-gas-reporter@^1.0.8" "solidity-coverage@^0.8.1" "typechain@^8.3.0" "@nomicfoundation/ignition-core@^0.15.9" "@nomicfoundation/hardhat-ignition@^0.15.9"
```

2. Create an .env file and Set up environment variables (This is for zksync testnet) refer to the .env.example:
PRIVATE_KEY=your_private_key_here
ZKSYNC_TESTNET=https://sepolia.era.zksync.dev

3. Compile the contracts:
```bash
npx hardhat compile
```
Output: You should see 3 new folders (artifacts, cache-zk, deployments-zk) being created

4. Update the contract addresses in the scripts (This is automated - no need to actually run this step):
```bash
npx ts-node scripts/update-addresses.ts
```

5. Deploy the contracts
```bash
npx hardhat deploy --network zkSyncTestnet
```
OR
```bash
npx hardhat run deploy/deploy.ts --network zkSyncTestnet
```
Output: There should be new log files created in the logs folder.

# OPTIONAL
How to perfrom contract verification:
```bash
npx hardhat verify --network zkSyncTestnet <contract-address><Name><Symbol>
```
# Example Commands:

# For FidToken
npx hardhat verify --network zkSyncTestnet 0xD2aAdCAEBcbd4C4E6451A4473731F8B26c3CDB63 "FidToken" "FID"

# For zkMessages
npx hardhat verify --network zkSyncTestnet 0xB9Ae7Ab2Cce0862CbE5754D282F985De637Cf8F7 0xD2aAdCAEBcbd4C4E6451A4473731F8B26c3CDB63

Also we are logging the Block Explorer URL in the log file which can be used to verify the transactions details.

