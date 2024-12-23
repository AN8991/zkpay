import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ZKPay API Documentation',
      version: '1.0.0',
      description: 'API documentation for ZKPay - POC for paymaster transactions',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Local development server',
      },
    ],
  },
  apis: ['./api/routes/*.ts'], // Path to the API routes
};

export const specs = swaggerJsdoc(options);
