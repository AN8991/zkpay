import * as fs from 'fs';
import * as path from 'path';

export function updateContractAddresses(fidTokenAddress: string, zkMessagesAddress: string) {
  const projectRoot = process.cwd();

  // Update mint-token.ts
  const mintTokenPath = path.join(projectRoot, 'scripts', 'mint-token.ts');
  let mintTokenContent = fs.readFileSync(mintTokenPath, 'utf8');
  mintTokenContent = mintTokenContent.replace(
    /const TOKEN_CONTRACT_ADDRESS = "";/,
    `const TOKEN_CONTRACT_ADDRESS = "${fidTokenAddress}";`
  );
  fs.writeFileSync(mintTokenPath, mintTokenContent);

  // Update paymaster-transaction.ts
  const paymasterTransactionPath = path.join(projectRoot, 'scripts', 'paymaster-transaction.ts');
  let paymasterTransactionContent = fs.readFileSync(paymasterTransactionPath, 'utf8');
  paymasterTransactionContent = paymasterTransactionContent.replace(
    /const ZKMESSAGES_ADDRESS = "";/,
    `const ZKMESSAGES_ADDRESS = "${zkMessagesAddress}";`
  );
  paymasterTransactionContent = paymasterTransactionContent.replace(
    /const FIDTOKEN_ADDRESS = "";/,
    `const FIDTOKEN_ADDRESS = "${fidTokenAddress}";`
  );
  fs.writeFileSync(paymasterTransactionPath, paymasterTransactionContent);

  console.log('Contract addresses updated successfully');
}
