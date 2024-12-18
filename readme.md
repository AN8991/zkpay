# ZkSync Smart Contract Project

## Prerequisites
- Node.js v16+ 
- npm or yarn

## Sepolia testnet network details

Network Name: ZKsync Sepolia Testnet
RPC URL: https://sepolia.era.zksync.dev
Chain ID: 300
Currency Symbol: ETH
Block Explorer URL: https://sepolia.explorer.zksync.io
WebSocket URL: wss://sepolia.era.zksync.dev/ws

## Dependencies

```bash
npm install --save-dev --legacy-peer-deps hardhat @nomicfoundation/hardhat-toolbox typescript ts-node @matterlabs/hardhat-zksync-solc @matterlabs/hardhat-zksync-deploy @matterlabs/hardhat-zksync-verify @matterlabs/zksync-contracts zksync-web3 ethers@^6.12.2 dotenv @types/node prettier prettier-plugin-solidity
```

## Installation

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/your-repo/zksync-smart-contract.git
cd zksync-smart-contract
npm install
```

2. Install required packages:
```bash
npm install
```

3. Set up environment variables (This is for zksync testnet):
PRIVATE_KEY=your_private_key_here
ZKSYNC_TESTNET=https://sepolia.era.zksync.dev

4. Compile & Deploy the contract:

# Compile the contracts
```bash
npx hardhat compile
```

# Deploy both the contracts
```bash
npx hardhat deploy
```
OR
```bash
npx hardhat run deploy/deploy.ts --network zkSyncTestnet
```

5. Verify the contract:
```bash
npx hardhat verify --network zkSyncTestnet <contract-address>
```
