// ======================= ENV MUST BE FIRST =======================
import dotenv from 'dotenv';
dotenv.config();

console.log('🔐 ENV CHECK:', {
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS_EXISTS: !!process.env.SMTP_PASS
});

// ======================= IMPORTS =======================
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import chalk from 'chalk';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import departmentRoutes from './routes/departments.js';
import dashboardRoutes from './routes/dashboard.js';
import categoriesRouter from './routes/categories.js';
import adminProfileRoutes from './routes/adminProfiles.js';
import companyRoutes from './routes/companies.js';
import ticketRoutes from './routes/tickets.js';
import timeTrackingRoutes from './routes/timeTracking.js';

// ======================= APP SETUP =======================
const app = express();
const PORT = process.env.PORT || 3001;

// ======================= MIDDLEWARE =======================
app.use(cors({ origin: true, credentials: true }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(hpp());
app.use(compression());

app.use(morgan('dev'));

// ======================= ROUTES =======================
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/categories', categoriesRouter);
app.use('/api/admin-profiles', adminProfileRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/time-tracking', timeTrackingRoutes);

// ======================= DB + SERVER =======================
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(chalk.green('✓ MongoDB Connected'));

    app.listen(PORT, () => {
      console.log(chalk.green(`✓ Server running on http://localhost:${PORT}`));
    });
  } catch (err) {
    console.error(chalk.red('Startup failed:'), err);
    process.exit(1);
  }
};

startServer();

export default app;
