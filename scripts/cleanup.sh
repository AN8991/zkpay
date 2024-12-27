#!/bin/bash

# Cleanup script for ZKPay project

# Function to print colored output
print_status() {
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    NC='\033[0m' # No Color
    echo -e "${GREEN}[CLEANUP]${NC} ${YELLOW}$1${NC}"
}

# Remove deployment details
print_status "Removing deployment details..."
rm -f w:/Projects/zkpay/deployment.json
rm -rf w:/Projects/zkpay/deployments-zk/zkSyncTestnet

# Clear log files
print_status "Clearing log files..."
rm -rf w:/Projects/zkpay/logs/*

# Remove artifacts and cache
print_status "Cleaning artifacts and cache directories..."
rm -rf w:/Projects/zkpay/artifacts-zk/*
rm -rf w:/Projects/zkpay/cache-zk/*
rm -rf w:/Projects/zkpay/typechain-types/*

# Reset contract addresses in files
print_status "Resetting contract addresses..."
sed -i 's/const ZKMESSAGES_ADDRESS = ".*";/const ZKMESSAGES_ADDRESS = "";/' w:/Projects/zkpay/scripts/paymaster-transaction.ts
sed -i 's/const FIDTOKEN_ADDRESS = ".*";/const FIDTOKEN_ADDRESS = "";/' w:/Projects/zkpay/scripts/paymaster-transaction.ts
sed -i 's/const TOKEN_CONTRACT_ADDRESS = ".*";/const TOKEN_CONTRACT_ADDRESS = "";/' w:/Projects/zkpay/scripts/mint-token.ts

# Optional: Clear hardhat cache
print_status "Clearing Hardhat cache..."
npx hardhat clean

print_status "Cleanup complete!"