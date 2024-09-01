const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0', // Overall API version
      description: 'API documentation for User API with multiple versions',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Version 1',
      },
      {
        url: 'http://localhost:3000/api/v2',
        description: 'Version 2',
      },
    ],
  },
  apis: ['./routes/v1/*.js', './routes/v2/*.js'], // Path to API routes for documentation
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
