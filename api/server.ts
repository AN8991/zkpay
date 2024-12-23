import express from 'express';
import cors from 'cors';
import { ethers } from 'ethers';
import { config } from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import rateLimit from 'express-rate-limit';
import tokenRoutes from './routes/token';
import walletRoutes from './routes/wallet';
import { specs } from './swagger';

// Load environment variables from root directory
config({ path: path.join(__dirname, '../.env') });

// Log environment variables for debugging
console.log('Environment loaded:', {
    FIDTOKEN_ADDRESS: process.env.FIDTOKEN_ADDRESS,
    RPC_URL: process.env.RPC_URL,
    WALLET_ADDRESS: process.env.WALLET_ADDRESS
});

const app = express();
const port = process.env.API_PORT || 8080;

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/token', tokenRoutes);
app.use('/api/wallet', walletRoutes);

// Health check endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
    res.json({ status: 'healthy' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
