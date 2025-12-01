import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import chalk from 'chalk';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';

// Routes
import authRoutes from './routes/auth.js';
import tokenRoutes from './routes/tokens.js';
import userRoutes from './routes/users.js';
import departmentRoutes from './routes/departments.js';
import dashboardRoutes from './routes/dashboard.js';
import categoriesRouter from './routes/categories.js';
import adminProfilesRouter from './routes/adminProfiles.js';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(chalk.red('✗ Missing required environment variables:'), missingEnvVars.join(', '));
  console.error(chalk.yellow('⚠ Please set these in your .env file'));
}

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Compression
app.use(compression());

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests explicitly
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Enhanced logging with morgan and chalk
if (NODE_ENV !== 'test') {
  morgan.token('colored-status', (req, res) => {
    const status = res.statusCode;
    if (status >= 500) return chalk.red(status);
    if (status >= 400) return chalk.yellow(status);
    if (status >= 300) return chalk.cyan(status);
    if (status >= 200) return chalk.green(status);
    return chalk.gray(status);
  });

  app.use(morgan((tokens, req, res) => {
    return [
      chalk.blue(tokens.method(req, res)),
      chalk.white(tokens.url(req, res)),
      tokens['colored-status'](req, res),
      chalk.white(`${tokens.res(req, res, 'content-length') || '-'}b`),
      chalk.gray(`${tokens['response-time'](req, res)}ms`),
      chalk.magenta(`from ${req.ip}`)
    ].join(' ');
  }));
}

// MongoDB connection with enhanced logging
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(chalk.green('✓') + ' MongoDB connected successfully');
    console.log(chalk.blue('  Host:') + ` ${conn.connection.host}`);
    console.log(chalk.blue('  Database:') + ` ${conn.connection.name}`);
    console.log(chalk.blue('  Port:') + ` ${conn.connection.port}`);

    // MongoDB event listeners
    mongoose.connection.on('error', (err) => {
      console.error(chalk.red('✗ MongoDB connection error:'), err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log(chalk.yellow('⚠ MongoDB disconnected'));
    });

    mongoose.connection.on('reconnected', () => {
      console.log(chalk.green('✓ MongoDB reconnected'));
    });

  } catch (error) {
    console.error(chalk.red('✗ MongoDB connection failed:'), error.message);
    process.exit(1);
  }
};

// Routes with enhanced logging
console.log(chalk.cyan('📝 Registering API routes...'));
app.use('/api/auth', authRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/categories', categoriesRouter);
app.use('/api/admin-profiles', adminProfilesRouter);
console.log(chalk.green('✓') + ' All routes registered successfully');

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: NODE_ENV
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Token System API',
    version: '1.0.0',
    environment: NODE_ENV,
    endpoints: {
      auth: '/api/auth',
      tokens: '/api/tokens',
      users: '/api/users',
      departments: '/api/departments',
      dashboard: '/api/dashboard',
      categories: '/api/categories',
      adminProfiles: '/api/admin-profiles'
    },
    documentation: 'Add your API docs URL here'
  });
});

// Enhanced 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(chalk.red('✗ Error:'), err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: NODE_ENV === 'production' ? 'Something went wrong!' : err.message,
    ...(NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(chalk.yellow(`\n⚠ Received ${signal}, shutting down gracefully...`));

  server.close(() => {
    console.log(chalk.green('✓ HTTP server closed'));

    mongoose.connection.close(false, () => {
      console.log(chalk.green('✓ MongoDB connection closed'));
      process.exit(0);
    });
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error(chalk.red('✗ Could not close connections in time, forcefully shutting down'));
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Start server
const server = app.listen(PORT, '0.0.0.0', async () => {
  console.log(chalk.cyan('\n🚀 Token System Server Starting...'));
  console.log(chalk.cyan('═'.repeat(50)));

  await connectDB();

  console.log(chalk.cyan('═'.repeat(50)));
  console.log(chalk.green('✓') + ` Server is running in ${chalk.yellow(NODE_ENV)} mode`);
  console.log(chalk.blue('📍') + ` Local:    ${chalk.underline.white(`http://localhost:${PORT}`)}`);
  console.log(chalk.blue('🌐') + ` Network:  ${chalk.underline.white(`http://0.0.0.0:${PORT}`)}`);
  console.log(chalk.blue('📊') + ` Health:   ${chalk.underline.white(`http://localhost:${PORT}/health`)}`);
  console.log(chalk.blue('🔧') + ` API Info: ${chalk.underline.white(`http://localhost:${PORT}/api`)}`);
  console.log(chalk.cyan('═'.repeat(50)));
  console.log(chalk.gray('Press Ctrl+C to stop the server\n'));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(chalk.red('✗ Unhandled Promise Rejection:'), err);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(chalk.red('✗ Uncaught Exception:'), err);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

export default app;