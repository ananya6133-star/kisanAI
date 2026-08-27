import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🌾 KisanAI Agricultural Advisory API Server running on port ${PORT}`);
  console.log(`🌐 Health check endpoint: http://localhost:${PORT}/api/health`);
  console.log(`🤖 AI Engine Model: ${process.env.GEMINI_MODEL || 'gemini-2.5-flash'}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
