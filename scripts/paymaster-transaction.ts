import { Provider, utils, Wallet } from "zksync-ethers";
import * as ethers from "ethers";
import * as hre from "hardhat";

// Contract addresses
const ZKMESSAGES_ADDRESS = "0x6585C15Dc7F561a269F909ad9Aa7959a76Fe5300"; // Add your zkMessages contract address
const FIDTOKEN_ADDRESS = "0xEFAC725DfC83DEc89ca04B836F925d6cDb82382D";
const PAYMASTER_ADDRESS = "0x3cb2b87d10ac01736a65688f3e0fb1b070b3eea3"; // Add the paymaster contract address

async function main() {
  // Get the provider
  const provider = new Provider("https://sepolia.era.zksync.dev");
  
  // Initialize wallet using private key
  const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
  const wallet = new Wallet(PRIVATE_KEY, provider);

  // Get the token contract instance
  const tokenArtifact = await hre.artifacts.readArtifact("FidToken");
  const tokenContract = new ethers.Contract(
    FIDTOKEN_ADDRESS,
    tokenArtifact.abi,
    wallet
  );

  // Get the zkMessages contract instance
  const messagesArtifact = await hre.artifacts.readArtifact("zkMessages");
  const messagesContract = new ethers.Contract(
    ZKMESSAGES_ADDRESS,
    messagesArtifact.abi,
    wallet
  );

  // Encode the approval call
  const approveData = tokenContract.interface.encodeFunctionData("approve", [
    PAYMASTER_ADDRESS,
    ethers.parseEther("5.0"), // Approve 5 tokens for fees
  ]);

  // Encode the message sending call
  const messageData = messagesContract.interface.encodeFunctionData("sendMessage", [
    "This message's fees were paid in FidToken!"
  ]);

  // Get the gas price and calculate fees
  const gasPrice = await provider.getGasPrice();
  const baseFee = gasPrice;
  const maxPriorityFeePerGas = ethers.parseUnits("0.1", "gwei");
  const maxFeePerGas = baseFee + maxPriorityFeePerGas;

  // Prepare paymaster params
  const paymasterParams = utils.getPaymasterParams(PAYMASTER_ADDRESS, {
    type: "ApprovalBased",
    token: FIDTOKEN_ADDRESS,
    minimalAllowance: ethers.parseEther("1.0"),
    innerInput: new Uint8Array(),
  });

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

  // Send transaction
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

  // Log transaction details & block explorer URL
  console.log("\nTransaction Details:");
  console.log("-------------------");
  console.log(`Transaction Hash: ${sentTx.hash}`);
  console.log(`Block Explorer URL: https://sepolia.explorer.zksync.io/tx/${sentTx.hash}`);

  // Wait for transaction and get receipt
  console.log("Transaction sent: ", sentTx.hash);
  const receipt = await sentTx.wait();

  // Calculate and log fees
  const gasUsed = receipt.gasUsed;
  const txFee = gasUsed * maxFeePerGas;
  
  console.log("\nFee Details:");
  console.log("------------");
  console.log(`Gas Used: ${gasUsed.toString()}`);
  console.log(`Effective Gas Price: ${ethers.formatUnits(maxFeePerGas, "gwei")} gwei`);
  console.log(`Total Fee Paid in FidToken: ${ethers.formatEther(txFee)} FID`);

  // Verify the message was sent
  const lastMessage = await messagesContract.getLastMessage();
  console.log("\nTransaction Result:");
  console.log("-----------------");
  console.log("Last message: ", lastMessage);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });