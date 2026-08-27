import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import healthRoutes from './routes/health.routes.js';
import advisoryRoutes from './routes/advisory.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));

// CORS Configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON Body Parser with payload limit
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: true, limit: '500kb' }));

// Request Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Global General Rate Limiter on API endpoints
app.use('/api', generalLimiter);

// API Routes
app.use('/api', healthRoutes);
app.use('/api/advisories', advisoryRoutes);

// Static Client Serving (when deployed as a single combined Render Web Service)
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // API Root Welcome Endpoint when accessed as standalone API backend
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      service: 'KisanAI - AI-Powered Agriculture Crop Advisory Assistant API',
      status: 'active',
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        advisories: '/api/advisories'
      },
      repository: 'https://github.com/ananya6133-star/kisanAI'
    });
  });

  app.use(notFoundHandler);
}

// Error Handling
app.use(errorHandler);

export default app;
