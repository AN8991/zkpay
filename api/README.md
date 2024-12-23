# zkPay API Server

This API server provides endpoints to interact with the zkPay smart contracts.

## Environment Variables Required

```
PORT=8080                      # API server port (optional, defaults to 8080)
RPC_URL=                       # Your zkSync Era testnet/mainnet RPC URL
EXPLORER_URL=                  # Your zkSync Era testnet/mainnet Explorer URL
PRIVATE_KEY=                   # Private key for signing transactions
FIDTOKEN_ADDRESS=              # Deployed FidToken contract address
WALLET_ADDRESS=                # Deployed Wallet contract address
```

## Available Endpoints

### Messages API

#### GET /api/messages/count
Returns the total number of messages sent.

#### GET /api/messages/last
Returns the last message sent.

#### POST /api/messages/send
Sends a new message.
```json
{
    "message": "Your message here"
}
```

### Token API

#### GET /api/token/balance/:address
Returns the token balance for the specified address.

#### POST /api/token/mint
Mints new tokens (only callable by owner).
```json
{
    "to": "0x...",
    "amount": "1000000000000000000"
}
```

#### POST /api/token/transfer
Transfers tokens from the sender to another address.
```json
{
    "to": "0x...",
    "amount": "1000000000000000000"
}
```

## Running the Server

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm run start:api
```

For development with auto-reload:
```bash
npm run dev:api
```

3. Access the Swagger API documentation at http://localhost:8080/api-docs
