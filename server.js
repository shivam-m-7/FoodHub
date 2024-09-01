const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { connectDB, sequelize } = require('./config/db');
const userRoutesV1 = require('./routes/v1/userRoutes');
//const userRoutesV2 = require('./routes/v2/userRoutes');
dotenv.config();
const app = express();

connectDB();
const PORT = process.env.PORT || 3000;

// Create a rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    headers: true, // Adds rate limit info to the headers
  });

  // Middleware
app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        upgradeInsecureRequests: [],
      },
    },
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }))
  app.use(limiter)
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));


// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Versioned routes
app.use('/api/v1/users', userRoutesV1);
//app.use('/api/v2/users', userRoutesV2);
app.use('/api/v1/auth', require('./routes/v1/auth'));
// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the User API');
});

// Sync Sequelize models
sequelize.sync().then(() => {
    console.log('Database synced');
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
