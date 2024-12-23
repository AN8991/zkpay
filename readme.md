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
npm install --save --legacy-peer-deps @openzeppelin/contracts@^5.1.0 @types/express-rate-limit@^5.1.3 @types/swagger-jsdoc@^6.0.4 @types/swagger-ui-express@^4.1.7 cors@^2.8.5 express@^4.18.2 express-rate-limit@^7.5.0 swagger-jsdoc@^6.2.8 swagger-ui-express@^5.0.1 ws@^8.18.0 @matterlabs/hardhat-zksync-deploy@^1.6.0 @matterlabs/hardhat-zksync-node@^1.2.1 @matterlabs/hardhat-zksync-solc@^1.2.5 @matterlabs/hardhat-zksync-verify@^1.7.1 @matterlabs/zksync-contracts@^0.6.1 @nomicfoundation/hardhat-chai-matchers@^2.0.8 @nomicfoundation/hardhat-ethers@^3.0.8 @nomicfoundation/hardhat-ignition@^0.15.9 @nomicfoundation/hardhat-ignition-ethers@^0.15.9 @nomicfoundation/hardhat-network-helpers@^1.0.12 @nomicfoundation/hardhat-toolbox@^5.0.0 @nomicfoundation/ignition-core@^0.15.9 @typechain/ethers-v6@^0.5.1 @typechain/hardhat@^9.1.0 @types/chai@^4.3.20 @types/cors@^2.8.17 @types/express@^4.17.21 @types/mocha@^10.0.10 @types/node@^22.10.2 dotenv@^16.4.7 ethers@^6.13.4 hardhat@^2.22.17 hardhat-gas-reporter@^1.0.10 nodemon@^3.0.2 prettier@^3.4.2 prettier-plugin-solidity@^1.4.1 solidity-coverage@^0.8.14 ts-node@^10.9.2 typechain@^8.3.2 typescript@^5.7.2 zksync-ethers@^6.15.3 zksync-web3@^0.17.1
```
If you modify the project with new packages or dependencies, you might need to run the following command with package name:
```bash
npm install --save --legacy-peer-deps
```

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

