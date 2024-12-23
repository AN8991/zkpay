import { Provider, utils, Wallet } from "zksync-ethers";
import * as ethers from "ethers";
import * as hre from "hardhat";
import * as path from "path";

import { log, clearLogFile } from "../utils/logger";
import { handleMainError } from "../utils/error-handler";

// Contract addresses
const ZKMESSAGES_ADDRESS = "0xB9Ae7Ab2Cce0862CbE5754D282F985De637Cf8F7";
const FIDTOKEN_ADDRESS = "0xD2aAdCAEBcbd4C4E6451A4473731F8B26c3CDB63";
const PAYMASTER_ADDRESS = "0x3cb2b87d10ac01736a65688f3e0fb1b070b3eea3";

async function main() {
  // Clear previous log file
  clearLogFile('paymaster-transaction');

  try {
    // Get the provider
    const provider = new Provider("https://sepolia.era.zksync.dev");
    log('paymaster-transaction', "Provider initialized");

    // Initialize wallet using private key
    const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
    const wallet = new Wallet(PRIVATE_KEY, provider);
    log('paymaster-transaction', `Using wallet: ${wallet.address}`);

    // Get the token contract instance
    const tokenArtifact = await hre.artifacts.readArtifact("FidToken");
    const tokenContract = new ethers.Contract(
      FIDTOKEN_ADDRESS,
      tokenArtifact.abi,
      wallet
    );
    log('paymaster-transaction', `Connected to FidToken at ${FIDTOKEN_ADDRESS}`);

    // Get the zkMessages contract instance
    const messagesArtifact = await hre.artifacts.readArtifact("zkMessages");
    const messagesContract = new ethers.Contract(
      ZKMESSAGES_ADDRESS,
      messagesArtifact.abi,
      wallet
    );
    log('paymaster-transaction', `Connected to zkMessages at ${ZKMESSAGES_ADDRESS}`);

    // Encode the approval call
    const approveData = tokenContract.interface.encodeFunctionData("approve", [
      PAYMASTER_ADDRESS,
      ethers.parseEther("5.0"), // Approve 5 tokens for fees
    ]);
    log('paymaster-transaction', "Approval call encoded");

    // Encode the message sending call
    const messageData = messagesContract.interface.encodeFunctionData("sendMessage", [
      "This message's fees were paid in FidToken!"
    ]);
    log('paymaster-transaction', "Message sending call encoded");

    // Get the gas price and calculate fees
    const gasPrice = await provider.getGasPrice();
    const baseFee = gasPrice;
    const maxPriorityFeePerGas = ethers.parseUnits("0.1", "gwei");
    const maxFeePerGas = baseFee + maxPriorityFeePerGas;
    log('paymaster-transaction', `Estimated gas fee: ${ethers.formatEther(maxFeePerGas)} ETH`);

    // Prepare paymaster params
    const paymasterParams = utils.getPaymasterParams(PAYMASTER_ADDRESS, {
      type: "ApprovalBased",
      token: FIDTOKEN_ADDRESS,
      minimalAllowance: ethers.parseEther("1.0"),
      innerInput: new Uint8Array(),
    });
    log('paymaster-transaction', "Paymaster parameters encoded");

    // Estimate gas limit with paymaster
    const gasLimit = await provider.estimateGas({
      from: wallet.address,
      to: ZKMESSAGES_ADDRESS,
      data: messageData,
      customData: {
        gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
        paymasterParams,
      },
    });
    log('paymaster-transaction', `Estimated gas limit: ${gasLimit}`);

    // Send transaction
    log('paymaster-transaction', "Sending transaction with paymaster...");
    const sentTx = await wallet.sendTransaction({
      to: ZKMESSAGES_ADDRESS,
      data: messageData,
      maxFeePerGas,
      maxPriorityFeePerGas,
      gasLimit,
      customData: {
        paymasterParams,
        gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      },
    });
    log('paymaster-transaction', `Transaction hash: ${sentTx.hash}`);

    // Log transaction details & block explorer URL
    log('paymaster-transaction', "\nTransaction Details:");
    log('paymaster-transaction', "-------------------");
    log('paymaster-transaction', `Transaction Hash: ${sentTx.hash}`);
    log('paymaster-transaction', `Block Explorer URL: https://sepolia.explorer.zksync.io/tx/${sentTx.hash}`);

    // Wait for transaction and get receipt
    log('paymaster-transaction', `Transaction sent: ${sentTx.hash}`);
    const receipt = await sentTx.wait();

    // Calculate and log fees
    const gasUsed = receipt.gasUsed;
    const txFee = gasUsed * maxFeePerGas;
    log('paymaster-transaction', "\nFee Details:");
    log('paymaster-transaction', "------------");
    log('paymaster-transaction', `Gas Used: ${gasUsed.toString()}`);
    log('paymaster-transaction', `Effective Gas Price: ${ethers.formatUnits(maxFeePerGas, "gwei")} gwei`);
    log('paymaster-transaction', `Total Fee Paid in FidToken: ${ethers.formatEther(txFee)} FID`);

    // Verify the message was sent
    const lastMessage = await messagesContract.getLastMessage();
    log('paymaster-transaction', `\nTransaction Result:\n-----------------\nLast message: ${lastMessage}`);

  } catch (error) {
    log('paymaster-transaction', `Error occurred: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

// Use the new error handler
handleMainError(main, 'paymaster-transaction');