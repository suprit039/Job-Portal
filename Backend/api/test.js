// Simple test API to verify basic functionality
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));

// Test routes
app.get("/", (req, res) => {
    res.json({
        message: "Backend is working!",
        success: true,
        timestamp: new Date().toISOString()
    });
});

app.get("/api", (req, res) => {
    res.json({
        message: "API endpoint is working!",
        success: true,
        env: process.env.NODE_ENV || 'development'
    });
});

app.get("/api/test", (req, res) => {
    res.json({
        message: "Test endpoint working!",
        success: true,
        environment: {
            nodeEnv: process.env.NODE_ENV,
            hasMongoUri: !!process.env.MONGO_URI,
            hasSecretKey: !!process.env.SECRET_KEY,
            hasCloudName: !!process.env.CLOUD_NAME
        }
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        message: 'Internal server error',
        success: false,
        error: error.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        message: `Route ${req.originalUrl} not found`,
        success: false
    });
});

export default app;