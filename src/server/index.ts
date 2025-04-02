import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { requestController } from './controllers/requestController';

dotenv.config();

const app = express();
const DEFAULT_PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection with better error handling
async function connectToDatabase() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Request routes
const asyncHandler = (fn: RequestHandler): RequestHandler => 
  (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.post('/api/requests/:requestId/approve', asyncHandler(requestController.approveRequest as RequestHandler));
app.post('/api/requests/:requestId/deny', asyncHandler(requestController.denyRequest as RequestHandler));
app.post('/api/requests/:requestId/assign', asyncHandler(requestController.assignExpert as RequestHandler));
app.post('/api/requests/:requestId/answer', asyncHandler(requestController.startAnswering as RequestHandler));
app.post('/api/requests/:requestId/move-to-expert', asyncHandler(requestController.moveToSection as RequestHandler));
app.post('/api/requests/:requestId/move-to-general', asyncHandler(requestController.moveToSection as RequestHandler));
app.post('/api/requests/:requestId/refund', asyncHandler(requestController.processRefund as RequestHandler));
app.get('/api/experts/available', asyncHandler(requestController.getAvailableExperts as RequestHandler));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fboyfilter');
    console.log('✅ Connected to MongoDB successfully');

    // Try to find an available port
    const findAvailablePort = (startPort: number): Promise<number> => {
      return new Promise((resolve, reject) => {
        const server = app.listen(startPort)
          .on('listening', () => {
            server.close(() => resolve(startPort));
          })
          .on('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
              // Port is busy, try next port
              findAvailablePort(startPort + 1)
                .then(resolve)
                .catch(reject);
            } else {
              reject(err);
            }
          });
      });
    };

    const port = await findAvailablePort(DEFAULT_PORT);
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 