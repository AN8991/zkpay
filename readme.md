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

3. Set up environment variables:
PRIVATE_KEY=your_private_key_here
ZKSYNC_TESTNET=your_zksync_testnet_url
```bash
cp .env.example .env
```

4. Deploy the contract:

# For FidToken contract
```bash
npx hardhat run scripts/deploy.ts --network zkSyncTestnet
```
# For zkMessages contract
```bash
npx hardhat run scripts/deploy-messages.ts --network zkSyncTestnet
```
```bash
npx hardhat deploy
```

5. Verify the contract:
```bash
npx hardhat verify --network zkSyncTestnet <contract-address>
```
