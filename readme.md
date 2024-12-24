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
npm install --save --legacy-peer-deps 
```
If you modify the project with new packages or dependencies, you might need to run the aboce command again.


2. Create an .env file and Set up environment variables (This is for zksync testnet) refer to the .env.example:
PRIVATE_KEY=your_private_key_here
ZKSYNC_TESTNET=https://sepolia.era.zksync.dev

3. Compile the contracts:
```bash
npx hardhat compile
```
Output: You should see 3 new folders (artifacts, cache-zk, deployments-zk) being created

4. Deploy the contracts
```bash
npx hardhat deploy --network zkSyncTestnet
```
OR
```bash
npx hardhat run deploy/deploy.ts --network zkSyncTestnet
```
Output: There should be new log files created in the logs folder.

# API
npm run start:api


# FRONTEND - Built on Next.js
```bash
npm run dev
```

# OPTIONAL
1.How to perfrom contract verification:
```bash
npx hardhat verify --network zkSyncTestnet <contract-address><Name><Symbol>
```
Example Commands:

For FidToken
```bash
npx hardhat verify --network zkSyncTestnet 0xD2aAdCAEBcbd4C4E6451A4473731F8B26c3CDB63 "FidToken" "FID"
```

For zkMessages
```bash
npx hardhat verify --network zkSyncTestnet 0xB9Ae7Ab2Cce0862CbE5754D282F985De637Cf8F7 0xD2aAdCAEBcbd4C4E6451A4473731F8B26c3CDB63
```
Also we are logging the Block Explorer URL in the log file which can be used to verify the transactions details.

2. How to run cleanup script (Use Gitbash if on Windows):
```bash
bash w:/Projects/zkpay/scripts/cleanup.sh
```

