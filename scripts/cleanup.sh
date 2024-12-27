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
rm -f w:/Projects/zkpay/deployments-zk/*

# Clear log files
print_status "Clearing log files..."
rm -rf w:/Projects/zkpay/logs/*

# Remove artifacts and cache
print_status "Cleaning artifacts and cache directories..."
rm -rf w:/Projects/zkpay/artifacts-zk/*
rm -rf w:/Projects/zkpay/cache-zk/*
rm -rf w:/Projects/zkpay/typechain-types/*

# Optional: Clear hardhat cache
print_status "Clearing Hardhat cache..."
npx hardhat clean

# Optional: Remove node_modules (uncomment if you want to do a full reset)
# print_status "Removing node_modules (WARNING: This will require reinstalling dependencies)..."
# rm -rf w:/Projects/zkpay/node_modules
# rm -f w:/Projects/zkpay/package-lock.json

print_status "Cleanup completed successfully!"